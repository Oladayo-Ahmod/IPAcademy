import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'completeCourse' : ActorMethod<[bigint], boolean>,
  'createCourse' : ActorMethod<
    [string, string, bigint, string, Array<string>, bigint],
    bigint
  >,
  'enrollStudent' : ActorMethod<[bigint], boolean>,
  'getCourseById' : ActorMethod<
    [bigint],
    [] | [
      {
        'id' : bigint,
        'title' : string,
        'duration' : bigint,
        'students' : Array<Principal>,
        'prerequisites' : Array<string>,
        'instructor' : Principal,
        'description' : string,
        'skillLevel' : string,
        'price' : bigint,
      }
    ]
  >,
  'getCourses' : ActorMethod<
    [],
    Array<
      {
        'id' : bigint,
        'title' : string,
        'duration' : bigint,
        'students' : Array<Principal>,
        'prerequisites' : Array<string>,
        'instructor' : Principal,
        'description' : string,
        'skillLevel' : string,
        'price' : bigint,
      }
    >
  >,
  'registerStudent' : ActorMethod<[string, string, Array<string>], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
