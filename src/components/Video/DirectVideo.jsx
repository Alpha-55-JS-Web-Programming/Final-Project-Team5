import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../AppContext";
import UserVideo from "./UserVideo";
import RemoteVideo from "./RemoteVideo";
import ModalCallerCalling from "./ModalCallerCalling";
import ModalCallee from "./ModalCallee";
import {
  addIncomingToDb,
  removeIncoming,
  createTableRow,
  addOfferToDb,
  listenForAnswer,
  addAnswerToDb,
  getOfferFromDb,
  addIceCandidateToDb,
  listenForIceCandidates,
  listenForIncomingCall,
  deleteTableRow,
} from "../../service/videoCall.service";
import { useLocation, useParams } from "react-router-dom";
import { useCall } from "../../CallContext";

export default function DirectVideo() {
  const { user } = useContext(AppContext);
  let { id: calleeId } = useParams();
  const { state } = useLocation();
  const calleeName = state?.username;
  const locationState = useLocation().state;
  const autoCall = state?.autoCall;
  const { incomingCall, setIncomingCall } = useCall();

  const [isCalling, setIsCalling] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [callId, setCallId] = useState(null);

  // mute/camera state
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const [iceServers, setIceServers] = useState(null);
  const pc = useRef(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const iceQueue = useRef([]);
  const isCallerRef = useRef(false);

  useEffect(() => {
    const getIceServers = async () => {
      try {
        // handler
        const res = await fetch("/api/turn");
        const data = await res.json();
        console.log("ICE servers:", data.iceServers);
        setIceServers(data.iceServers);
      } catch (err) {
        console.error("Failed to fetch ICE servers:", err);
      }
    };
    getIceServers();
  }, []);

  useEffect(() => {
    if (locationState?.autoJoin && locationState?.callId && locationState?.callKey && iceServers) {
      handleJoinCall({
        callId: locationState.callId,
        key: locationState.callKey,
        callerId: locationState.callerId,
        callerName: locationState.username,
      });
    }
  }, [locationState, iceServers]);

  useEffect(() => {
    if (autoCall && calleeId && calleeName && iceServers) {
      handleStartCall({ id: calleeId, username: calleeName });
    }
  }, [autoCall, calleeId, calleeName, iceServers]);

  const handleEndCall = async () => {
    if (activeCall?.callId) {
      // remove call from Firebase
      try {
        if (isCallerRef.current) {
          await removeIncoming(activeCall.calleeId, activeCall.key);
          await deleteTableRow(activeCall.callId);
        } else {
          await removeIncoming(activeCall.key);
          await deleteTableRow(activeCall.callId);
        }
      } catch (err) {
        console.error("Failed to clean up call in DB:", err);
      }
    }
    if (pc.current) {
      pc.current.getSenders().forEach((s) => s.track?.stop());
      pc.current.close();
      pc.current = null;
    }
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setActiveCall(null);
    setIncomingCall(null);
    setIsCalling(false);
    setSelectedUser(null);
    setCallId(null);
    setIsMuted(false);
    setIsCameraOff(false);
    iceQueue.current = [];
  };

  useEffect(() => {
    if (location.state?.autoCall && calleeId && calleeName) {
      handleStartCall({ id: calleeId, username: calleeName });
    }
  }, [location.state]);

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  // Toggle mute
  const toggleMute = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => (track.enabled = isMuted));
    setIsMuted((prev) => !prev);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => (track.enabled = isCameraOff));
    setIsCameraOff((prev) => !prev);
  };

  // Flush queued ICE
  const flushIceQueue = async () => {
    if (!pc.current || !pc.current.remoteDescription) return;
    for (let c of iceQueue.current) {
      if (c?.candidate) await pc.current.addIceCandidate(c).catch(console.warn);
    }
    iceQueue.current = [];
  };

  const handleStartCall = async ({ id: calleeId, username: calleeName }) => {
    setSelectedUser({ id: calleeId, username: calleeName });
    setIsCalling(true);
    isCallerRef.current = true;

    if (!iceServers) {
      console.error("ICE servers not ready yet");
      return;
    }
    pc.current = new RTCPeerConnection({ iceServers });
    // Get local media
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    stream.getTracks().forEach((t) => pc.current.addTrack(t, stream));

    // Remote stream
    pc.current.ontrack = (e) => setRemoteStream(e.streams[0]);

    // Create callId early so ICE can go straight to DB
    const newCallId = await createTableRow();
    setCallId(newCallId);
    // flush caller ICE
    for (let c of iceQueue.current) {
      if (c?.candidate) await addIceCandidateToDb(newCallId, c, true);
    }
    iceQueue.current = [];

    // ICE candidates
    pc.current.onicecandidate = (e) => {
      if (e.candidate?.candidate) {
        if (!e.candidate?.candidate) return;
        addIceCandidateToDb(newCallId, e.candidate, true);
      }
    };

    // Create offer
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    await addOfferToDb(newCallId, offer);

    // Add yourself as incoming for callee
    const incomingKey = await addIncomingToDb(newCallId, user.uid, user.username, calleeId);

    // Listen for answer and remote ICE
    listenForAnswer(newCallId, async (answer) => {
      if (!answer) return;
      await pc.current.setRemoteDescription(answer);
      flushIceQueue();
    });

    listenForIceCandidates(newCallId, true, async (candidate) => {
      if (!candidate?.candidate) return;
      if (!pc.current.remoteDescription) iceQueue.current.push(candidate);
      else await pc.current.addIceCandidate(candidate).catch(console.warn);
    });

    setActiveCall({ callId: newCallId, calleeId, key: incomingKey });
    setIsCalling(false);
  };

  const handleJoinCall = async (incomingCallData) => {
    const { callId: cid, key } = incomingCallData;
    setCallId(cid);
    isCallerRef.current = false;

    if (!iceServers) {
      console.error("ICE servers not ready yet");
      return;
    }
    pc.current = new RTCPeerConnection({ iceServers });

    // Get local stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    stream.getTracks().forEach((t) => pc.current.addTrack(t, stream));

    // Remote stream
    pc.current.ontrack = (e) => setRemoteStream(e.streams[0]);

    // ICE candidates
    pc.current.onicecandidate = (e) => {
      if (!e.candidate?.candidate) return;
      if (!pc.current.remoteDescription) {
        iceQueue.current.push(e.candidate);
      } else {
        addIceCandidateToDb(cid, e.candidate, false);
      }
    };

    try {
      // Wait for offer in DB (retry)
      let offer = null;
      for (let i = 0; i < 20; i++) {
        offer = await getOfferFromDb(cid);
        if (offer) break;
        console.warn(`Offer not found yet, retrying...`);
        await new Promise((res) => setTimeout(res, 500));
      }
      if (!offer) throw new Error("No offer found in DB after retries");

      await pc.current.setRemoteDescription(offer);

      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      await addAnswerToDb(cid, answer);

      // Flush queued ICE after remote description is set
      for (let c of iceQueue.current) {
        if (c?.candidate) await pc.current.addIceCandidate(c).catch(console.warn);
      }
      iceQueue.current = [];

      // Listen for remote ICE from caller
      listenForIceCandidates(cid, false, async (candidate) => {
        if (!candidate?.candidate) return;
        if (!pc.current.remoteDescription) {
          iceQueue.current.push(candidate);
        } else {
          try {
            await pc.current.addIceCandidate(candidate);
          } catch (err) {
            console.warn("Failed to add caller ICE:", err);
          }
        }
      });

      setActiveCall({ callId: cid, calleeId: user.uid, key });
    } catch (err) {
      console.error("handleJoinCall failed:", err);
      alert("Could not join the call. Please try again.");
    } finally {
      setIncomingCall(null);
    }
  };

  return (
    <div>
      {/* {isCalling && selectedUser && (
        <ModalCallerCalling callee={selectedUser.username} onCancel={handleEndCall} />
      )} */}

      {incomingCall && (
        <ModalCallee
          callData={incomingCall}
          onAccept={async () => {
            try {
              await handleJoinCall(incomingCall);
              setIncomingCall(null);
            } catch (err) {
              console.error("Failed to join call:", err);
              alert("Joining failed, try again.");
            }
          }}
          onReject={async () => {
            try {
              await removeIncoming(user.uid, incomingCall.key);
            } catch (err) {
              console.error("Failed to clean DB on reject:", err);
            } finally {
              setIncomingCall(null);
            }
          }}
        />
      )}

      {(activeCall || isCalling || incomingCall) && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          {remoteStream ? (
            <div className="relative w-full max-w-5xl h-[70vh] bg-black rounded-xl overflow-hidden shadow-lg">
              <RemoteVideo ref={remoteVideoRef} stream={remoteStream} />

              {localStream && (
                <div className="absolute bottom-4 right-4 w-32 h-24 rounded-lg overflow-hidden shadow-xl border-2 border-white">
                  <UserVideo ref={localVideoRef} stream={localStream} />
                </div>
              )}

              {activeCall && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                  <button
                    onClick={toggleMute}
                    className={`bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition ${isMuted ? "bg-gray-500" : ""}`}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    <i className={`ri-mic${isMuted ? "-off-line" : "-line"} text-xl`}></i>
                  </button>

                  <button
                    onClick={toggleCamera}
                    className={`bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition ${isCameraOff ? "bg-gray-500" : ""}`}
                    title={isCameraOff ? "Turn camera on" : "Turn camera off"}
                  >
                    <i className={`ri-camera${isCameraOff ? "-off-line" : "-line"} text-xl`}></i>
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition"
                  >
                    <i className="ri-phone-line text-xl"></i>
                  </button>
                </div>
              )}
            </div>
          ) : (
            activeCall && (
              <div className="bg-gray-900 p-8 rounded-xl shadow-xl text-white flex flex-col items-center">
                <p className="text-lg">Waiting for the other participant...</p>
                <div className="mt-4">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <button
                  onClick={handleEndCall}
                  className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded shadow-lg transition"
                >
                  Cancel
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
