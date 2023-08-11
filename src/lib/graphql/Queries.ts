import { gql } from "@apollo/client";

/*
  * GraphQL Queries
*/

/**
 * Query to get all teachers and periods
 * 
 * To access teachers, use `data.teachers`
 * To access periods, use `data.periods`
 */
export const GET_ALL_TEACHERS_PERIODS = gql`
  query getTeachers {
    teachers: allTeachers {
      name
      id
      honorific
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