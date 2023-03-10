import { Component, createSignal, Show } from "solid-js";
import { invoke } from '@tauri-apps/api/tauri'
import { setServerIp, connect, isConnected, setIsConnected, setActivity, serverIp, activity, selfIp, selfPort, sessionId, forwardingId } from "../comm";
import { turnOnLED, turnOffLED } from "../commands";
import { emit, listen } from '@tauri-apps/api/event'
import { appWindow } from "@tauri-apps/api/window";

// states of error message and connect button
const [connectDisplay, setConnectDisplay] = createSignal("Connect");
const [connectionMessage, setConnectionMessage] = createSignal('');
const [showSessionId, setShowSessionId] = createSignal(false);
const [showForwardingId, setShowForwardingId] = createSignal(false);

// function to connect to the server + input validation
async function connectToServer() {
  setConnectDisplay("Connecting...");
  setConnectionMessage('');

  // getting the ip, username, and password from the relevant textfields
  var ip = (document.getElementsByName('server-ip')[0] as HTMLInputElement).value.trim();
  var username = (document.getElementsByName('username')[0] as HTMLInputElement).value.trim();
  var password = (document.getElementsByName('password')[0] as HTMLInputElement).value;
  var result = '';

  // presence check on username and password
  if (username != '' && password != '') {
    result = await connect(ip, username, password);
  } else {
    result = 'Please enter a username and password';
  }

  setConnectionMessage(result);
  setConnectDisplay("Connect");
}

// get the activity from the taskbar page
emit('requestActivity');
listen('updateActivity', (event) => {
  setActivity(event.payload as number);
});

// function to close the sessionId info
function closeSessionId(evt:MouseEvent) {
  var popup = document.getElementById("session-id")!;
  console.log(evt.target);
  console.log(popup);
  if ((evt.target as HTMLElement).id != popup.id && (evt.target as HTMLElement).className != 'id-display'){
    setShowSessionId(false);
  }
  console.log(showSessionId());
}
// function to close the forwardingId info
function closeForwardingId(evt:MouseEvent) {
  var popup = document.getElementById("forwarding-id")!;
  if ((evt.target as HTMLElement).id != popup.id && (evt.target as HTMLElement).className != 'id-display'){
    setShowForwardingId(false);
  }
  console.log(showForwardingId());
}

document.addEventListener("click", (evt) => closeSessionId(evt));
document.addEventListener("click", (evt) => closeForwardingId(evt));

const Connect: Component = (props) => {
  return <div style="height: 100%; display: flex; flex-direction: column">
    <div style="text-align: center; font-size: 14px">CONNECT</div>
    <div class="system-connect-page">
      <div class="system-connect-section">
        <input class="connect-textfield"
          type="text"
          name="server-ip"
          placeholder="Server IP"
        />
        <input class="connect-textfield"
          type="text"
          name="username"
          placeholder="Username"
        />
        <input class="connect-textfield"
          type="password"
          name="password"
          placeholder="Password"
        />
        <div id="connect-message" style="font-size: 12px">
          {connectionMessage()}
        </div>
        <button class="connect-button" onClick={() => connectToServer()}>
          {connectDisplay()}
        </button>
        <div style="height: 20px"></div>
        <button style="padding: 5px" onClick={() => {turnOnLED(); emit('activity', setActivity(0))}}>
          LED test button (on)
        </button>
        <div style="height: 10px"></div>
        <button style="padding: 5px" onClick={() => turnOffLED()}>
          LED test button (off)
        </button>
      </div>
      <div class="system-connect-section">
        <div style="display: grid; grid-template-columns: 1fr 1fr">
          <div style="display: flex; flex-direction: column; margin-right: 20px">
            <div style="text-align: right">Activity:</div>
            <div style="text-align: right">Status:</div>
            <div style="text-align: right">IP:</div>
            <div style="text-align: right">Port:</div>
            <div style="text-align: right">Server IP:</div>
            <div style="text-align: right">Session ID:</div>
            <div style="text-align: right">Forwarding ID:</div>
          </div>
          <div style="display: flex; flex-direction: column; margin-left: 0px">
            <div style="text-align: center" id="activity">{activity()} ms</div>
            <div style="text-align: center" id="status">{isConnected()? "CONNECTED":"DISCONNECTED"}</div>
            <div style="text-align: center">{selfIp() as string}</div>
            <div style="text-align: center">{selfPort() as string}</div>
            <div style="text-align: center">{serverIp() as string}</div>
            <div id="session-id" style="text-align: center">{sessionId() == 'None'? sessionId() as string : 
              <Show 
                when={showSessionId()}
                fallback={<button id="session-id" class="connect-info-button" 
                onClick={() => {setShowSessionId(true); console.log(showSessionId())}}>Click to view</button>}
              >
                <div class='id-display'>{sessionId() as string}</div>
              </Show>}
            </div>
            <div style="text-align: center" id="forwarding-id">{forwardingId() == 'None'? forwardingId() as string : 
              <Show 
                when={showForwardingId()}
                fallback={<button id="forwarding-id" class="connect-info-button" 
                onClick={() => {setShowForwardingId(true); console.log(showForwardingId())}}>Click to view</button>}
              >
                <div class='id-display'>{forwardingId() as string}</div>
              </Show>}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* <div style="height: 65px"></div> */}
</div>
}

const Feedsystem: Component = (props) => {
  return <div style="height: 100%">
    <div style="text-align: center; font-size: 14px">FEEDSYSTEM</div>
    <div class="system-feedsystem-page">
      BRUh
    </div>
</div>
}

const Config: Component = (props) => {
  return <div style="height: 100%">
    <div style="text-align: center; font-size: 14px">CONFIGURATION</div>
    <div class="system-config-page">
      BRUh
    </div>
</div>
}

const Sequences: Component = (props) => {
  return <div style="height: 100%">
    <div style="text-align: center; font-size: 14px">SEQUENCES</div>
    <div class="system-sequences-page">
      BRUh
    </div>
</div>
}

export {Connect, Feedsystem, Config, Sequences};