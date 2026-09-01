import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface EnrollmentStatusEvent {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Injectable({
  providedIn: 'root'
})
export class LiveSyncService {
  private platformId = inject(PLATFORM_ID);
  private connection: HubConnection | null = null;
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
    if (this.connection) return;
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      this.connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5029/hubs/tms')
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Stop retrying after 2 attempts if server returns 500/404 to avoid console spam
            if (retryContext.previousRetryCount >= 2) {
              return null;
            }
            return 5000;
          }
        })
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
      this.connection.onclose(() => this.connectionState.set('disconnected'));

      this.connection
        .start()
        .then(() => this.connectionState.set('connected'))
        .catch(() => {
          // Gracefully fallback to BroadcastChannel without throwing red console error spam
          this.connectionState.set('disconnected');
        });
    } catch {
      this.connectionState.set('disconnected');
    }
  }

  emitLocalUpdate(id: string, status: EnrollmentStatusEvent['status']) {
    const payload: EnrollmentStatusEvent = { id, status };
    this.eventsSubject.next(payload);  // Update current tab
    this.channel?.postMessage(payload); // Broadcast to other open tabs
  }
}
