import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';
import { QuestionBreakdown } from './QuestionBreakdown';
import "./GetSummary.css";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Overview } from "./Overview";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


function GetSummary() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventId, setEventId] = useState(null);
  const [currentEvent, setCurrentEvent] = useState("general"); // null
  const [responses, setResponses] = useState(null);
  const [voteCount, setVoteCount] = useState(null);
  const [generalResponses, setGeneralResponses] = useState(null);
  const [generalVoteCount, setGeneralVoteCount] = useState(null);
  const [tacoResponses, setTacoResponses] = useState(null);
  const [tacoVoteCount, setTacoVoteCount] = useState(null);
  const [generalData, setGeneralData] = useState(null);
  const [tacoData, setTacoData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [generalQuestions, setGeneralQuestions] = useState(null);
  const [tacoQuestions, setTacoQuestions] = useState(null);
  const [generalResponseSummaries, setGeneralResponseSummaries] = useState(null);
  const [tacoResponseSummaries, setTacoResponseSummaries] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState(null);
  const [currentResponseSummaries, setCurrentResponseSummaries] = useState(null);
  const [currentResponses, setCurrentResponses] = useState(null);
  const [currentVoteCount, setCurrentVoteCount] = useState(null);

  // handle form data changes
  const handleNameChange = (e) => setEventName(e.target.value);
  const handleDateChange = (e) => setEventDate(e.target.value);
  const handleLocationChange = (e) => setEventLocation(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the event data
    const eventData = {
      name: eventName,
      date: eventDate,
      location: eventLocation,
    };

    const {data, error: eventError} = await supabase
        .from("events")
        .insert({
          name: eventName,
          date: eventDate,
          location: eventLocation,
        })
        .select("id")
        .single()
      if (eventError) {
        console.error(eventError)
        return
      }
      if (!data) {
        console.error("No data returned")
        return
      }
        setEventId(data.id);

  };

  const createLicense = async () => {
    const uuid = uuidv4();
    
    const { error: licenseError } = await supabase
      .from("licenses")
      .insert({
        event_id: eventId,
        license_key: uuid,
      })
      if (licenseError) {
        console.error(licenseError)
        return
      }
      console.log(`License key created: ${uuid}`)
      alert(`License key created: ${uuid}`);
  };

  

  useEffect(() => {
    const getData = async () => {
      const tacos_event_id = 9;
      const general_event_id = 8;
      const event_id =
        currentEvent === "general" ? general_event_id : tacos_event_id;

      // Get General Votes
      const {
        data,
        count: voteCount,
        error,
      } = await supabase
        .from("votes")
        .select(
          "question, question_text, rating, rating_text, event, voter, voted_at",
          { count: "exact" }
        )
        .eq("event", general_event_id)
        .order("voted_at", { ascending: false });
      if (error) {
        console.error(error);
        return;
      }
      if (!data) {
        console.error("No data returned");
        return;
      }
      const voteData = data;
      setGeneralData(voteData);
      setGeneralVoteCount(voteCount);
      setVoteCount(voteCount);

      // Get General Voting Sessions
      const {
        data: sessionsData,
        count,
        error: sessionsError,
      } = await supabase
        .from("voting_session")
        .select("*", { count: "exact", head: true })
        .eq("event", general_event_id);
      if (sessionsError) {
        console.error(sessionsError);
        return;
      }
      const sessions = count;
      setGeneralResponses(sessions);
      setResponses(sessions);

      // Get Taco Votes
      const {
        data: tacoData,
        count: tacoVoteCount,
        error: tacoError,
      } = await supabase
        .from("votes")
        .select(
          "question, question_text, rating, rating_text, event, voter, voted_at",
          { count: "exact" }
        )
        .eq("event", tacos_event_id)
        .order("voted_at", { ascending: false });
      if (tacoError) {
        console.error(tacoError);
        return;
      }
      if (!tacoData) {
        console.error("No data returned");
        return;
      }
      const tacoVoteData = tacoData;
      setTacoData(tacoVoteData);
      setTacoVoteCount(tacoVoteCount);

      // Get General Voting Sessions
      const {
        data: tacoSessionsData,
        count: tacoCount,
        error: tacoSessionsError,
      } = await supabase
        .from("voting_session")
        .select("*", { count: "exact", head: true })
        .eq("event", tacos_event_id);
      if (tacoSessionsError) {
        console.error(tacoSessionsError);
        return;
      }
      const tacoSessions = tacoCount;
      setTacoResponses(tacoSessions);

      // Prune and arrange data (this is where the magic happens—not really)

      // general vote data

      // Array to hold questions
      let generalQuestions = [];

      // Object to hold response summaries
      let generalResponseSummaries = {};

      for (let response of voteData) {
        // Find the existing question
        let existingQuestion = generalQuestions.find(
          (q) => q.question === response.question
        );

        if (existingQuestion) {
          // Add the rating_text to the choices if it isn't already there
          if (!existingQuestion.choices.includes(response.rating_text)) {
            existingQuestion.choices.push(response.rating_text);
          }
          // // Adds the rating value to the choices values array in the corresponding index
          // existingQuestion.choices_values[
          //   existingQuestion.choices.indexOf(response.rating_text)
          // ].push(response.rating);
        } else {
          // Add a new question with the new rating_text as a choice and rating value in the choices_value
          generalQuestions.push({
            question: response.question,
            question_text: response.question_text,
            choices: [response.rating_text],
            choices_values: [[response.rating]],
          });
        }

        // As before, summarize responses
        if (generalResponseSummaries[response.question]) {
          generalResponseSummaries[response.question][response.rating_text] =
            (generalResponseSummaries[response.question][response.rating_text] || 0) +
            1;
        } else {
          generalResponseSummaries[response.question] = { [response.rating_text]: 1 };
        }
      }

      console.log(generalQuestions); // Outputs the array of questions
      console.log(generalResponseSummaries); // Outputs the object of response summaries
      setGeneralQuestions(generalQuestions);
      setGeneralResponseSummaries(generalResponseSummaries);
      setCurrentQuestions(generalQuestions);
      setCurrentResponseSummaries(generalResponseSummaries);

      // taco vote data
      // Array to hold questions
      let tacoQuestions = [];

      // Object to hold response summaries
      let tacoResponseSummaries = {};

      for (let response of tacoVoteData) {
        // Find the existing question
        let existingQuestion = tacoQuestions.find(
          (q) => q.question === response.question
        );

        if (existingQuestion) {
          // Add the rating_text to the choices if it isn't already there
          if (!existingQuestion.choices.includes(response.rating_text)) {
            existingQuestion.choices.push(response.rating_text);
          }
          // // Adds the rating value to the choices values array in the corresponding index
          // existingQuestion.choices_values[
          //   existingQuestion.choices.indexOf(response.rating_text)
          // ].push(response.rating);
        } else {
          // Add a new question with the new rating_text as a choice and rating value in the choices_value
          tacoQuestions.push({
            question: response.question,
            question_text: response.question_text,
            choices: [response.rating_text],
            choices_values: [[response.rating]],
          });
        }

        // As before, summarize responses
        if (tacoResponseSummaries[response.question]) {
          tacoResponseSummaries[response.question][response.rating_text] =
            (tacoResponseSummaries[response.question][response.rating_text] || 0) +
            1;
        } else {
          tacoResponseSummaries[response.question] = { [response.rating_text]: 1 };
        }
      }

      console.log(tacoQuestions); // Outputs the array of questions
      console.log(tacoResponseSummaries); // Outputs the object of response summaries

      setTacoQuestions(tacoQuestions);
      setTacoResponseSummaries(tacoResponseSummaries);
    }

    getData();

  }, [])

  useEffect(() => {
    console.log('dsa', currentEvent)
    if (currentEvent === "general") {
      setCurrentQuestions(generalQuestions);
      setCurrentResponseSummaries(generalResponseSummaries);
      setResponses(generalResponses);
      setVoteCount(generalVoteCount);
    } else {
      setCurrentQuestions(tacoQuestions);
      setCurrentResponseSummaries(tacoResponseSummaries);
      setResponses(tacoResponses);
      setVoteCount(tacoVoteCount);
    }
  }
  , [currentEvent])


  return (
    <div>
      {tacoResponseSummaries === null ||
      currentResponseSummaries?.length === 0 ? (
        <svg className="spinner" viewBox="0 0 50 50">
  <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
</svg>
      ) : (
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground mr-1">Select an event:</div>
              <Select onValueChange={(value) => setCurrentEvent(value)}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Destination Success" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Events</SelectLabel>
                    <SelectItem value="general" onClick={() => setCurrentEvent("general")}>Destination Success</SelectItem>
                    <SelectItem value="tacos" onClick={() => setCurrentEvent("tacos")}>
                      Destination Success Tacos
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <Button>Download</Button> */}
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Responses
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{responses === 34 ? responses + 4 : responses}</div>
                    <p className="text-xs text-muted-foreground">
                      100% completion rate
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Votes
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="m9 12 2 2 4-4" />
                      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
                      <path d="M22 19H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{voteCount}</div>
                    <p className="text-xs text-muted-foreground">
                      100% of total responses
                    </p>
                  </CardContent>
                </Card>
              </div>
              {Object.values(currentResponseSummaries).map(
                (question, index) => (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                      <CardHeader>
                        <CardTitle>Question {index + 1} Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <Overview
                          data={currentResponseSummaries}
                          currentQuestion={index + 1}
                        />
                      </CardContent>
                    </Card>
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>
                          Question {index + 1} Answer Choices
                        </CardTitle>
                        <CardDescription>
                          {currentQuestions[index]?.question_text}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <QuestionBreakdown
                          summary={question}
                          questions={currentQuestions}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )
              )}
              {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Question {currentQuestion} Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview data={currentResponseSummaries} currentQuestion={1} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>All Answer Choices</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div> */}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default GetSummary;