"use client";

import "regenerator-runtime/runtime";
import React, { useCallback, useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { isAbortError } from "next/dist/server/pipe-readable";
import "./speech-input.css";

interface OrderResult {
  success: boolean;
  message: string;
}

export default function SpeechInput(): JSX.Element {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult>();

  const submitOrder = useCallback(
    async (body: string, signal: AbortSignal): Promise<OrderResult> => {
      const result = await fetch("/api/order", {
        method: "POST",
        body,
        signal,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const message = await result.text();

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const jsonMessage = JSON.parse(message);

        // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-return
        return { success: true, message: JSON.stringify(jsonMessage, null, 2) };
      } catch (error) {
        if (error instanceof SyntaxError) {
          // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-return
          return {
            success: true,
            message,
          };
        }

        // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions
        return { success: false, message: `${error}` };
      }
    },
    []
  );

  useEffect(() => {
    if (transcript === "") {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const timeout = setTimeout(() => {
      setOrdering(true);
      submitOrder(transcript, signal)
        .then((result) => {
          setOrderResult(result);
          resetTranscript();
        })
        .catch((error) => {
          if (isAbortError(error)) {
            return;
          }

          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          setOrderResult({ success: false, message: `${error}` });
          resetTranscript();
        })
        .finally(() => {
          setOrdering(false);
          controller.abort();
        });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [resetTranscript, submitOrder, transcript]);

  useEffect(() => {
    if (!ordering && microphoneEnabled) {
      if (listening) {
        return;
      }

      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

      return;
    }

    if (!listening) {
      return;
    }

    SpeechRecognition.stopListening().catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  }, [listening, microphoneEnabled, ordering]);

  const handleButtonClick = (): void => {
    setMicrophoneEnabled((prev) => !prev);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>{`Your browser doesn't support speech recognition.`}</span>;
  }

  return (
    <div className="c-speeh-input">
      <div className="max-w-xl mx-auto sm:flex sm:justify-center">
        <button
          className={`flex items-center px-5 py-3 mt-3 text-base font-medium text-white border-2 bg-slate-300 ${buildButtonClassName(
            microphoneEnabled,
            ordering
          )} rounded-lg`}
          onClick={handleButtonClick}
          type="button"
        >
          <div className="text-2xl">
            {buttonIcon(microphoneEnabled, ordering)}
          </div>
          {buttonText(microphoneEnabled, ordering)}
        </button>
      </div>
      <h2 className="mx-auto mt-5 text-2xl font-semibold tracking-tight text-center text-gray-300 sm:text-3xl">
        {transcript}
      </h2>

      <div className="mx-auto mt-5 text-2xl font-semibold tracking-tight text-center text-gray-300 sm:text-3xl">
        {orderResult != null && (
          <div
            className={orderResult.success ? "font-semibold" : "text-red-600"}
          >
            {orderResult.message}
          </div>
        )}
      </div>
    </div>
  );
}

function buttonText(microphoneEnabled: boolean, ordering: boolean): string {
  if (ordering) {
    return "Submitting Order";
  }

  if (microphoneEnabled) {
    return "Opened";
  }

  return "Closed";
}

function buttonIcon(microphoneEnabled: boolean, ordering: boolean): string {
  if (ordering) {
    return "🔃";
  }

  if (microphoneEnabled) {
    return "✅";
  }

  return "⛔";
}

function buildButtonClassName(
  microphoneEnabled: boolean,
  ordering: boolean
): string {
  if (ordering) {
    return "--ordering";
  }

  if (microphoneEnabled) {
    return "--enabled";
  }

  return "--disabled";
}
