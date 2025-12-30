import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

export interface FacultyData {
    _id: string;
    name: string;
    abbreviation: string;
    logo: {
        title: string;
        description: string;
        url: string;
    };
    vision: string;
    about: string;
    mission: string;
    websiteLink?: string;
    facultyPhone?: string;
    facultyLinkedIn?: string;
    whatsappLink?: string;
    xComLink?: string;
    tiktokLink?: string;
    facultyEmail?: string;
    departmentsCollection?: {
        items: {
            _id: string;
            name: string;
            deptAbbreviation: string;
            deptLogo: { url: string };
        }[];
    };
}

interface Props {
    faculty: FacultyData;
}

const GET_FACULTY = gql`
  query GetFaculty($id: String!) {
    faculty(id: $id) {
        _id
        name
        abbreviation
        logo {
            title
            description
            url
        }
        vision
        mission
        about
        websiteLink
        facultyPhone
        facultyLinkedIn
        whatsappLink
        xComLink
        tiktokLink
        facultyEmail
        departmentsCollection {
            items {
                _id
                name
                deptAbbreviation
                deptLogo { url }
            }
        }
    }
  }
`;

const MOCK_FACULTY: FacultyData = {
    _id: "mock-id",
    name: "Faculty of Electrical and Computer Engineering",
    abbreviation: "FECE",
    logo: {
        title: "FECE Logo",
        description: "Logo of the faculty",
        url: "/images/img1.png"
    },
    vision: "To be a world-class center of excellence in Electrical and Computer Engineering education, research, and innovation, producing highly skilled professionals who drive technological advancement and societal transformation.",
    mission: "Our mission is to provide high-quality education and research opportunities in Electrical and Computer Engineering, fostering a culture of innovation, critical thinking, and ethical responsibility to address global challenges and contribute to national development.",
    about: "The Faculty of Electrical and Computer Engineering (FECE) at KNUST is one of the leading faculties in the College of Engineering. We offer a range of undergraduate and postgraduate programs designed to equip students with the knowledge and skills needed to excel in the rapidly evolving fields of electrical engineering, computer engineering, and telecommunications. Our state-of-the-art facilities and dedicated faculty members provide an environment conducive to learning and cutting-edge research.",
    websiteLink: "https://fece.knust.edu.gh",
    facultyPhone: "+233 24 000 0000",
    facultyLinkedIn: "https://linkedin.com/school/knust-fece",
    whatsappLink: "https://wa.me/233240000000",
    xComLink: "https://x.com/knust_fece",
    tiktokLink: "https://tiktok.com/@knust_fece",
    facultyEmail: "fece@knust.edu.gh",
    departmentsCollection: {
        items: [
            {
                _id: "dept-1",
                name: "Department of Computer Engineering",
                deptAbbreviation: "CompE",
                deptLogo: { url: "/images/img1.png" }
            },
            {
                _id: "dept-2",
                name: "Department of Electrical Engineering",
                deptAbbreviation: "EE",
                deptLogo: { url: "/images/img2.png" }
            }
        ]
    }
};

export const useFaculty = (id: string) => {
    return useFetchData<FacultyData>({
        queryKey: ["faculty", id],
        queryFn: async () => {
            return MOCK_FACULTY;
            /* 
            try {
                const data = await contentfulClient.request<Props>(GET_FACULTY, {
                    id,
                });
                return data.faculty;
            } catch (err: any) {
                throw err;
            }
            */
        },
        enabled: !!id,
    });
};
