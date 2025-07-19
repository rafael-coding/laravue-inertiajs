import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'd29e9c94a5cc1421f957',
    cluster: 'us2',
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    enableStats: false,
    authEndpoint: '/broadcasting/auth'
});

// Debug connection
window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('Pusher connected successfully');
});

window.Echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('Pusher disconnected');
});

window.Echo.connector.pusher.connection.bind('error', (error) => {
    console.error('Pusher connection error:', error);
});

