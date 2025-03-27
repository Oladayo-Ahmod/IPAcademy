export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'completeCourse' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'createCourse' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64, IDL.Text, IDL.Vec(IDL.Text), IDL.Nat64],
        [IDL.Nat],
        [],
      ),
    'enrollStudent' : IDL.Func([IDL.Nat], [IDL.Bool], []),
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
              'instructor' : IDL.Principal,
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
              'instructor' : IDL.Principal,
              'description' : IDL.Text,
              'skillLevel' : IDL.Text,
              'price' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'getCoursesCreatedByUser' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Nat,
              'title' : IDL.Text,
              'duration' : IDL.Nat64,
              'students' : IDL.Vec(IDL.Principal),
              'prerequisites' : IDL.Vec(IDL.Text),
              'instructor' : IDL.Principal,
              'description' : IDL.Text,
              'skillLevel' : IDL.Text,
              'price' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'getCoursesEnrolledByUser' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Nat,
              'title' : IDL.Text,
              'duration' : IDL.Nat64,
              'students' : IDL.Vec(IDL.Principal),
              'prerequisites' : IDL.Vec(IDL.Text),
              'instructor' : IDL.Principal,
              'description' : IDL.Text,
              'skillLevel' : IDL.Text,
              'price' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'getCurrentStudent' : IDL.Func(
        [],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Principal,
              'bio' : IDL.Text,
              'username' : IDL.Text,
              'purchasedCourses' : IDL.Vec(IDL.Text),
              'skills' : IDL.Vec(IDL.Text),
              'enrolledCourses' : IDL.Vec(IDL.Principal),
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
