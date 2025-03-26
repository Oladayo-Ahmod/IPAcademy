import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import {idlFactory } from "./dfx_generated/hello_world/hello_world.did.js"
const canisterId = process.env.NEXT_PUBLIC_CANISTER_ID;
const host = process.env.NEXT_PUBLIC_IC_HOST;

const agent = new HttpAgent({host})

// Fetch the root key for the local replica
if (process.env.NODE_ENV !== "production") {
  agent.fetchRootKey();
}

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

export default actor;