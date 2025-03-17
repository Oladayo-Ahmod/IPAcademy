import {
    IDL,query,update,StableBTreeMap,Principal
  } from "azle";

  import { v4 as uuidv4 } from "uuid";
  
  const Course =IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    description: IDL.Text,
    instructor: IDL.Opt(IDL.Principal),
    duration: IDL.Nat64,
    skillLevel: IDL.Text,
    prerequisites: Vec(text),
    price: nat64,
    students: Vec(Principal),
  });

export default class {
    message: string = 'Hello world!';

    @query([], IDL.Text)
    getMessage(): string {
        return this.message;
    }

    @update([IDL.Text])
    setMessage(message: string): void {
        this.message = message;
    }
}
