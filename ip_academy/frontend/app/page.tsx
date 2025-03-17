"use client"
import Image from "next/image";
import actor from '../app/utils/actor'
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>();
  const [message, setMessage] = useState<string>()

  const enterMessage =async()=>{
    try{
          console.log(message)
      	 actor.setMessage(message)
         console.log(data)
    }
    catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    console.log(actor)
    async function fetchData() {
      const result = await actor.getMessage();
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <div>
      <input onChange={(e)=>setMessage(e.target.value)} />
    <h1>Data from Canister:</h1>
    <p>{data}</p>
    <button onClick={enterMessage}>Enter Message</button>
  </div>
  );
}
