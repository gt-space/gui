import Footer from "../general-components/Footer";
import { GeneralTitleBar } from "../general-components/TitleBar";
import { Select } from "@thisbeyond/solid-select";
import { emit, listen } from "@tauri-apps/api/event";
import { createSignal, For} from "solid-js";
import ValveView from "./ValveView";
import { Valve } from "../devices";
import { closeValve, openValve } from "../commands";
import { Config, State } from "../comm";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

const [configurations, setConfigurations] = createSignal();
const [activeConfig, setActiveConfig] = createSignal();
export const [valves, setValves] = createSignal(new Array);


listen('state', (event) => {
  console.log(event.windowLabel);
  setConfigurations((event.payload as State).configs);
  setActiveConfig((event.payload as State).activeConfig);
  console.log(activeConfig());
  console.log(configurations() as Config[]);
  var activeconfmappings = (configurations() as Config[]).filter((conf) => {return conf.id == activeConfig() as string})[0];
  var vlvs = new Array;
  console.log(activeconfmappings);
  for (const mapping of activeconfmappings.mappings) {
    if (mapping.channel_type === 'valve') {
      vlvs.push(
        {
          name: mapping.text_id,
          group: 'Fuel',
          board_id: mapping.board_id,
          channel_type: "valve",
          channel: mapping.channel,
          open: false,
          feedback: false,
        },
      )
    }
  }
  setValves(vlvs);
  console.log('valves', valves());
});


function Valves() {
  invoke('initialize_state', {window: appWindow});
  const [seqButtonLabel, setSeqButtonLabel] = createSignal('Start Sequence');
  const [seqRunning, setSeqRunning] = createSignal(false);
  function toggleSequenceButton() {
    var button = document.getElementById("sequencebutton")!;
    if (seqRunning()) {
      setSeqButtonLabel('Start Sequence');
      setSeqRunning(false);
      button.style.backgroundColor = "#015878"
      button.style.setProperty('seqButtonBackgroundColor',  '#00425a!important');
    } else {
      setSeqButtonLabel('Abort Sequence');
      setSeqRunning(true);
      button.style.backgroundColor = "#C53434"
    }
  }

  return <div class="window-template">
    <div style="height: 60px">
      <GeneralTitleBar name="Valves"/>
    </div>
    <div class='valve-view'>
      <div class='sequences-panel'>
        <select
          class="sequences-dropdown"
          onChange={(e) => {
            console.log(e?.target.className);
          }}
        >
          <option class="seq-dropdown-item" value="seq1">Sequence 1</option>
          <option class="seq-dropdown-item" value="seq2">Sequence 2</option>
          <option class="seq-dropdown-item" value="seq3">Sequence 3</option>
          <option class="seq-dropdown-item" value="seq4">Sequence 4</option>
          <option class="seq-dropdown-item" value="seq5">Sequence 5</option>
          <option class="seq-dropdown-item" value="seq6">Sequence 6</option>
        </select>
        <div style={{flex: 1, padding: '5px'}}>
          <button class='toggle-sequence-button' id="sequencebutton" onClick={toggleSequenceButton}>
            {seqButtonLabel()}
          </button>
        </div>
      </div>
      <ValveView valves={valves() as Valve[]}/>
    </div>
    <div>
      <Footer/>
    </div>
</div>
}

export default Valves;