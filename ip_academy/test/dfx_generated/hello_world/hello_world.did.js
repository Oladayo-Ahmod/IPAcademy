export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'completeCourse' : IDL.Func([IDL.Nat, IDL.Principal], [IDL.Bool], []),
    'createCourse' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Principal,
          IDL.Nat64,
          IDL.Text,
          IDL.Vec(IDL.Text),
          IDL.Nat64,
        ],
        [IDL.Nat],
        [],
      ),
    'enrollStudent' : IDL.Func([IDL.Nat, IDL.Principal], [IDL.Bool], []),
    'getCourseById' : IDL.Func(
        [IDL.Nat],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Nat,
              'title' : IDL.Text,
              'duration' : IDL.Nat64,
              'students' : IDL.Vec(IDL.Principal),
              'prerequisites' : IDL.Vec(IDL.Text),
              'instructor' : IDL.Opt(IDL.Principal),
              'description' : IDL.Text,
              'skillLevel' : IDL.Text,
              'price' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'getCourses' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Nat,
              'title' : IDL.Text,
              'duration' : IDL.Nat64,
              'students' : IDL.Vec(IDL.Principal),
              'prerequisites' : IDL.Vec(IDL.Text),
              'instructor' : IDL.Opt(IDL.Principal),
              'description' : IDL.Text,
              'skillLevel' : IDL.Text,
              'price' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'registerStudent' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
        [IDL.Bool],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
