"use client";

import { useEffect, useRef } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import firebaseApp from "@/lib/firebase";

export function SoundNotificationManager() {
  const lastOrderIdRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isAudioInitializedRef = useRef(false);

  // Initialize audio context on user interaction
  useEffect(() => {
    const initializeAudio = () => {
      if (isAudioInitializedRef.current) return;

      try {
        // Initialize HTML5 Audio with custom sound file
        if (typeof window !== "undefined") {
          audioRef.current = new Audio();
          audioRef.current.src = "/notification.wav";
          audioRef.current.preload = "auto";

          // Try to play and pause immediately to unlock audio
          audioRef.current
            .play()
            .then(() => {
              audioRef.current?.pause();
              console.log("Audio initialized successfully");
            })
            .catch(() => {
              console.log(
                "Audio initialization failed, will use Web Audio API fallback"
              );
            });
        }

        // Initialize Web Audio API context
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        isAudioInitializedRef.current = true;
        console.log("Audio system initialized");
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    };

    // Initialize audio on first user interaction
    const handleUserInteraction = () => {
      initializeAudio();
      // Remove event listeners after initialization
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Function to play notification sound
  const playNotificationSound = () => {
    if (!isAudioInitializedRef.current) {
      console.log("Audio not initialized yet, skipping sound");
      return;
    }

    try {
      // console.log("Playing notification sound...");

      // Try HTML5 Audio first
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0.5;

        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // console.log("Notification sound played successfully");
            })
            .catch((error) => {
              console.error("Error playing sound:", error);
              // Fallback to Web Audio API
              playBeepSound();
            });
        }
      } else {
        // Fallback to Web Audio API
        playBeepSound();
      }
    } catch (error) {
      console.error("Error in playNotificationSound:", error);
      playBeepSound();
    }
  };

  // Fallback beep sound using Web Audio API
  const playBeepSound = () => {
    try {
      if (!audioContextRef.current) {
        console.log("Audio context not available");
        return;
      }

      // Resume audio context if suspended
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(
        800,
        audioContextRef.current.currentTime
      );
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + 0.3
      );

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);

      console.log("Fallback beep sound played");
    } catch (error) {
      console.error("Fallback sound also failed:", error);
    }
  };

  // Monitor orders for new arrivals
  useEffect(() => {
    console.log("Setting up order listener...");
    const db = getFirestore(firebaseApp);
    const ordersQuery = query(
      collection(db, "orders"),
      where("status", "in", ["pending", "preparing", "ready", "delivered"])
      // orderBy("createdAt", "desc") // Temporarily removed for indexing
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("SoundNotificationManager: Received orders:", orders.length);
      console.log(
        "SoundNotificationManager: Last order ID:",
        lastOrderIdRef.current
      );

      if (orders.length > 0) {
        // Since we're not using orderBy, find the most recent order
        const latestOrder = orders.reduce((latest, current) => {
          const latestTime =
            (latest as any).createdAt?.toDate?.() ||
            new Date((latest as any).createdAt);
          const currentTime =
            (current as any).createdAt?.toDate?.() ||
            new Date((current as any).createdAt);
          return currentTime > latestTime ? current : latest;
        });

        console.log(
          "SoundNotificationManager: Latest order ID:",
          latestOrder.id
        );
        console.log(
          "SoundNotificationManager: Latest order status:",
          (latestOrder as any).status
        );

        // Check for new orders (skip on initial load)
        if (
          lastOrderIdRef.current &&
          latestOrder.id !== lastOrderIdRef.current
        ) {
          console.log("New order detected! Playing notification sound...");
          playNotificationSound();
        } else {
          console.log(
            "No new order detected. Last ID:",
            lastOrderIdRef.current,
            "Current ID:",
            latestOrder.id
          );
        }

        // Update the last order ID
        lastOrderIdRef.current = latestOrder.id;
      }
    });

    return () => unsubscribe();
  }, []);

  // Return null since we don't need any UI
  return null;
}
