import React,{ useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AgoraRTC from '../src/helpers';
import useCamera from '../src/useCamera';
import useMicrophone from '../src/useMicrophone';
import StreamPlayer from "agora-stream-player";
import useMedia from '../src/useMedia';
const join = async  (client,uid)=>{
    const state = {
        uid,
        appId:'acfc6c9bc42a4de4bb2acf18cc9fd2e1',
        channel:'test',
        token:'006acfc6c9bc42a4de4bb2acf18cc9fd2e1IAB73CwzSiy13TqgBSP+WvrcKldnN3JmeYFcq6MHa17C1Ax+f9gAAAAAEACKm2Pb/iC/XgEAAQAFIb9e'
    }
    try {
        const uid = isNaN(Number(state.uid)) ? null : Number(state.uid);

        // initializes the client with appId
        await client.init(state.appId);

        // joins a channel with a token, channel, user id
        await client.join(state.token, state.channel, uid);

        // create a ne stream
        const stream = AgoraRTC.createStream({
            streamID: uid || 12345,
            video: true,
            audio: true,
            screen: false
        });

        // stream.setVideoProfile('480p_4')

        // Initalize the stream
        await stream.init();

        // Publish the stream to the channel.
        await client.publish(stream);

        // // Set the state appropriately
        // enqueueSnackbar(`Joined channel ${state.channel}`, { variant: "info" });
    } catch (err) {
        console.log(err);
        // enqueueSnackbar(`Failed to join, ${err}`, { variant: "error" });
    }
}
const App = () => {
    const cameraList = useCamera();
    const microphoneList = useMicrophone();
    const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8'});
    const [uId, setUid] = useState('12345');
    let [localStream, remoteStreamList, streamList] = useMedia(client);
    console.log(localStream,remoteStreamList);
    return (
    <div className="App">
      <input onChange={(res)=>setUid(res)}/>
      <button onClick={()=>join(client,uId)}>start</button>
      {localStream&&<StreamPlayer stream={localStream}/>}
      {
          remoteStreamList.map((stream) => (
            <StreamPlayer
                key={stream.getId()}
                stream={stream}
                fit="contain"
                label={stream.getId()}
            />
        ))
      }
    </div>
  );
}

export default App;
