import { gql } from '@apollo/client';

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
    query getAllData {
        teachers: allTeachers {
            id
            name {
                honorific
                last
                normal
            }
            absence {
                id
            }
            comments
            fullyAbsent
        }
        periods: allPeriods {
            id
            name
            timeRange {
                start
                end
            }
            teachersAbsent {
                id
            }
        }
    }
`;

export const GET_SUPPORT_FORM = gql`
    query GetSupportForm {
        attribs {
            supportFormUrl
        }
    }
`;
