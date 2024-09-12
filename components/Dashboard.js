"use client";
import { Fugaz_One } from "next/font/google";
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Loading from "./Loading";
import Login from "./Login";
import { ModalDialog } from "./ModalDialog";
import Button from "./Button";

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export default function Dashboard() {
  const { currentUser, userDataObj, setUserDataObj, loading } = useAuth();
  const [data, setData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState({});
  const [note, setNote] = useState("");

  const now = new Date();

  const handledOnClose = () => {
    setIsOpen(false);
  };

  function countValues() {
    let total_number_of_days = 0;
    let sum_moods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let days_mood = data[year][month][day]?.mood;
          total_number_of_days++;
          sum_moods += days_mood;
        }
      }
    }
    return {
      num_days: total_number_of_days,
      average_mood: sum_moods / total_number_of_days,
    };
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
  };

  async function handleSetMood(mood) {
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    try {
      const newData = { ...userDataObj };
      if (!newData?.[year]) {
        newData[year] = {};
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {};
      }

      newData[year][month][day] = {
        mood: mood,
        note: note,
      };
      // update the current state
      setData(newData);
      // update the global state
      setUserDataObj(newData);
      // update firebase
      const docRef = doc(db, "users", currentUser.uid);
      const res = await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: {
                mood: mood,
                note: note,
              },
            },
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.log("Failed to set data: ", err.message);
    }
  }

  async function handledUpdateNote() {
    const year = selectedDayData[3];
    const month = selectedDayData[2];
    const day = selectedDayData[1];
    const mood = selectedDayData[0]?.mood;
    console.log("inside update function", mood, day, month, year);
    try {
      const newData = { ...userDataObj };

      newData[year][month][day] = {
        mood: mood,
        note: note,
      };

      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(
        docRef,
        {
          [year]: {
            [month]: {
              [day]: {
                mood: mood,
                note: note,
              },
            },
          },
        },
        { merge: true }
      );

      setNote("");
      setSelectedDayData({});
      handledOnClose();
    } catch (error) {
      console.log("Failed to update data: ", error.message);
    }
  }

  const moods = {
    "&*@#$": "😭",
    Sad: "🥲",
    Existing: "😶",
    Good: "😊",
    Elated: "😍",
  };

  useEffect(() => {
    if (!currentUser || !userDataObj) {
      return;
    }
    setData(userDataObj);
  }, [currentUser, userDataObj]);

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg">
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className=" flex flex-col gap-1 sm:gap-2">
              <p className="font-medium capitalize text-xs sm:text-sm truncate">
                {status.replaceAll("_", " ")}
              </p>
              <p className={"text-base sm:text-lg truncate " + fugaz.className}>
                {statuses[status]}
                {status === "num_days" ? " 🔥" : ""}
              </p>
            </div>
          );
        })}
      </div>
      {/* <h1
        className={
          "text-base sm:text-lg text-center " + fugaz.className
        }
      >
        <span className="textGradient">{currentUser.email}</span>
      </h1> */}
      <h4
        className={
          "text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className
        }
      >
        How do you <span className="textGradient">feel</span> today?
      </h4>
      <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button
              onClick={() => {
                const currentMoodValue = moodIndex + 1;
                handleSetMood(currentMoodValue);
              }}
              className={
                "p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1 "
              }
              key={moodIndex}
            >
              <p className="text-4xl sm:text-5xl md:text-6xl">{moods[mood]}</p>
              <p
                className={
                  "text-indigo-500 text-xs sm:text-sm md:text-base " +
                  fugaz.className
                }
              >
                {mood}
              </p>
            </button>
          );
        })}
      </div>
      <Calendar
        completeData={data}
        handleSetMood={handleSetMood}
        setNote={setNote}
        note={note}
        setIsOpen={setIsOpen}
        setSelectedDayData={setSelectedDayData}
      />

      <ModalDialog isOpen={isOpen} onClose={handledOnClose}>
        <div className="flex flex-1 flex-col relative w-full">
          <div
            className="-mt-5 -mr-4 absolute -top-1 right-0 hover:text-red-500 p-1 px-2.5 rounded-full bg-red-100 hover:bg-red-300"
            onClick={handledOnClose}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>

          <div className="my-4 flex-1 min-w-80 max-w-[400px]">
            <h3
              className={
                fugaz.className +
                "text-base sm:text-lg md:text-xl my-3 font-semibold"
              }
            >
              Write / Update your note
            </h3>

            <div className="p-2 overflow-auto max-h-64 bg-indigo-200 text-indigo-600 font-semibold  rounded-lg my-5">
              {selectedDayData[0]?.note
                ? `" ${selectedDayData[0]?.note} "`
                : "No note! write a note ..."}
            </div>

            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
              className="w-full flex-1 text-nowrap px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 focus:border-2 py-2 sm:py-3 border border-solid border-indigo-400 rounded-lg outline-none"
              placeholder={note ? note : "write your note of the day"}
              // type="text"
              rows="4"
            />

            <div className="max-w-[400px] my-3 w-full mx-auto">
              <Button clickHandler={handledUpdateNote} text="Submit" full />
            </div>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
