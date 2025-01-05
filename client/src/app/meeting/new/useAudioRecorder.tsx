// hooks/useAudioRecorder.ts
import { time } from "console";
import { getRandomValues, randomInt } from "crypto";
import { useState, useCallback } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import useSWR from "swr";

// Function to send form data to backend
const fetcher = async (formData: FormData) => {
    const response = await fetch("http://localhost:8000/whisper", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error retrieving transcript.");
    }

    const data = await response.json();
    return data?.results[0]?.transcript || "Error retrieving transcript.";
//   const text = Math.round(Math.random() * 5);
//   return text.toString() + "  - Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus distinctio aliquid rerum! Aliquid aliquam dolore cupiditate vel corporis eveniet magnam hic adipisci optio recusandae fugiat, totam esse autem a repudiandae error quos, velit expedita minus voluptatum eligendi voluptate! Praesentium fugit suscipit, iste, tenetur dicta pariatur ullam necessitatibus molestias amet atque delectus eligendi explicabo cupiditate architecto iure dolorum vitae debitis, quod est nam ducimus perferendis. Aliquid totam consequuntur, laborum libero pariatur, cumque beatae quasi molestias facere dolore nulla, neque eius? Iusto ipsam voluptas maxime aperiam corporis quasi recusandae, ullam, quidem reiciendis amet quibusdam? Maxime ex fugit iste consectetur laboriosam repellat, excepturi aliquid iure numquam tempora dolorem, beatae quos possimus sunt dolores, facere nobis modi. Tenetur aliquid explicabo dicta recusandae, facilis doloremque non neque assumenda sunt maxime id doloribus reiciendis, nemo velit necessitatibus repellendus. Voluptas ipsam neque ullam numquam at dolorum iure totam accusantium magnam unde rerum, molestias modi animi obcaecati provident assumenda aut distinctio, in quos. Expedita quaerat odio consequatur inventore laudantium nihil non reiciendis debitis et eos minus delectus ducimus amet, necessitatibus dicta ex optio. Labore molestias sapiente deleniti laudantium incidunt autem repellat accusamus soluta similique commodi ducimus illo, impedit necessitatibus reprehenderit excepturi ipsa doloribus cum quam maxime id praesentium sequi fugit quo? Et non nam, blanditiis in obcaecati molestiae consectetur laboriosam enim repudiandae laborum. Obcaecati praesentium minima voluptatibus nulla hic sapiente ad eius tempore ab? Magnam temporibus maxime quaerat nesciunt dolor adipisci, modi voluptates sed dicta nihil ipsa, atque commodi optio fugit aspernatur culpa. Facilis cum velit unde suscipit, expedita nihil quod mollitia quo dolore eos sit repellendus officia labore soluta sequi magnam nulla aliquid saepe explicabo quis. Maiores veritatis ea pariatur officia temporibus! Incidunt esse nisi perspiciatis voluptate ea exercitationem id tempore ipsam sunt delectus, ullam, molestiae, quis fugiat aliquam quam autem velit! Commodi, vitae! Eaque fugiat, necessitatibus esse praesentium nam blanditiis expedita voluptatem culpa assumenda ab itaque veritatis. Repellat vero sunt quaerat aliquid voluptatum natus, porro recusandae placeat, necessitatibus possimus assumenda? Possimus itaque est tenetur perspiciatis illo molestias, ut saepe debitis expedita, at ex labore reprehenderit quibusdam? Atque mollitia molestias, dolorum facere dolorem est fuga rem expedita asperiores quam eaque non et modi nemo optio aut, nisi quisquam. Accusantium pariatur perferendis labore, repudiandae quasi numquam ratione ullam esse culpa quod harum possimus nisi alias optio repellendus aliquid explicabo veniam in. Labore debitis tenetur consectetur autem rerum quae voluptatum at neque recusandae fugit ducimus, sunt ipsum saepe temporibus dolore facere repellat veritatis nam magnam aliquam assumenda? Animi ad molestias libero adipisci reprehenderit, dolorem explicabo consequatur tenetur autem ullam maxime voluptate repellat debitis eius veniam sunt natus aperiam delectus sapiente distinctio quo? Odit dolorem fugit quam optio ad dolores voluptatum veritatis soluta odio non nobis, commodi a officia, iure expedita molestiae! Vitae esse, sunt, mollitia cupiditate consequatur libero tenetur, sed assumenda blanditiis corrupti natus fugit accusantium voluptate deleniti? Vitae, ducimus quod doloribus non doloremque aspernatur quos rerum est ullam facilis in velit vero! Architecto, laborum accusantium perferendis neque velit dicta sed, odio similique vel dolor provident illo officiis! Odio.";
};

export const useCustomAudioRecorder = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const recorderControls = useAudioRecorder();

  const {
    data: transcript,
    error,
    isLoading,
    mutate,
  } = useSWR(
    formData ? "http://localhost:8000/whisper" : null,
    () => formData && fetcher(formData),
    { revalidateOnFocus: false }
  );

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  const handleDiscard = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setFormData(null);
  };

  const handleSubmit = useCallback(() => {
    if (!audioBlob) return;

    const newFormData = new FormData();
    newFormData.append("files", audioBlob, "recording.mp3");
    setFormData(newFormData);
    mutate();
  }, [audioBlob, mutate]);

  return {
    audioUrl,
    transcript,
    isLoading,
    error,
    recorderControls,
    addAudioElement,
    handleDiscard,
    handleSubmit,
  };
};
