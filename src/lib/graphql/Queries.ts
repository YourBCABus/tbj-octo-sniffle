import { gql } from "@apollo/client";

export const GET_ALL_TEACHERS_PERIODS = gql`
  query getTeachers {
    teachers: allTeachers {
      name
      id
      absenceState {
        isFullyAbsent
        absentPeriods {
          name
          id
        }
      }
    }
    periods: allPeriods {
      name
      id
      teachersAbsent {
        id
      }
      timeRange {
        start
        end
      }
    }
  }
`;