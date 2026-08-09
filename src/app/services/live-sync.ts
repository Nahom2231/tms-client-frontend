import { inject,Injectable,PLATFORM_ID, signal } from '@angular/core';
import {isPlatformBrowser } from '@angular/common';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {Subject } from 'rxjs';

export interface EnrollmentStatusEvent {
    id: string;
    status: 'Pending'| 'Approved'|'Rejected';
}
@Injectable({
    providedIn: 'root'
})
export class LiveSyncService {
    private platformId = inject(PLATFORM_ID);
    private connection: HubConnection | null =null;
    private eventsSubject = new Subject<EnrollmentStatusEvent>();
    events$ = this.eventsSubject.asObservable();
    connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
    private channel: BroadcastChannel | null = null;

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.channel = new BroadcastChannel('enrollment-status');
            this.channel.onmessage = (event: MessageEvent) => {
                this.eventsSubject.next(event.data as EnrollmentStatusEvent);
            };
        }
    }

    connect() {
        if (this.connection) return
        if(!isPlatformBrowser(this.platformId)) return;

        this.connection = new HubConnectionBuilder()
        .withUrl('/hubs/tms')
        .withAutomaticReconnect([0, 2000,10000, 30000])
        .build();

        this.connection.on(
      'ReceiveEnrollmentStatusUpdated',
      (id: string, status: string) => {
        console.log('⚡ SignalR Event Received:', id, status);
        this.eventsSubject.next({ id, status: status as EnrollmentStatusEvent['status'] });
      }
        );
        this.connection.onreconnecting(() => this.connectionState.set('reconnecting'));
        this.connection.onreconnected(() => this.connectionState.set('connected'));
        this.connection.onclose(()=> this.connectionState.set('disconnected'));

        this.connection
        .start()
        .then(()=> this.connectionState.set('connected'))
        .catch(err => console.error('signalR connection error:', err));
    }
    emitLocalUpdate(id: string, status: EnrollmentStatusEvent['status']) {
    const payload: EnrollmentStatusEvent = { id, status };
    this.eventsSubject.next(payload);  // Update current tab
    this.channel?.postMessage(payload);
}
}

