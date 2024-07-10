import React, { useEffect, useRef, useState } from 'react';
import './App.css'; // Assuming you have some styles here

const App = () => {
    const [status, setStatus] = useState('Connection failed. Somebody may be using the socket.');
    const canvasRef = useRef(null);

    useEffect(() => {
        const openSocket = () => {
            let uri = "ws://" + window.location.hostname + ":8585";
            let socket = new WebSocket(uri);
            let msg = canvasRef.current;

            socket.addEventListener('open', (e) => {
                setStatus('Opened');
            });

            socket.addEventListener('message', (e) => {
                let ctx = msg.getContext('2d');
                let image = new Image();
                image.src = URL.createObjectURL(e.data);
                image.addEventListener('load', () => {
                    ctx.drawImage(image, 0, 0, msg.width, msg.height);
                });
            });

            socket.addEventListener('close', (e) => {
                setStatus('Connection closed.');
            });

            socket.addEventListener('error', (e) => {
                setStatus('Connection error.');
            });

            return () => {
                socket.close();
            };
        };

        openSocket();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Video Streaming Dashboard</h1>
            </header>
            <div>
                <div id="status">{status}</div>
                <div style={{ textAlign: 'center' }}>
                    <canvas ref={canvasRef} id="msg" width="960" height="720" style={{ display: 'inline-block' }} />
                </div>
            </div>
        </div>
    );
};

export default App;
