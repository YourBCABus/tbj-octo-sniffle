import { gql } from "@apollo/client";

export const GET_ALL_TEACHERS = gql`
  query getTeachers {
    teachers:allTeachers {
      name
      id
    }
  }
`;