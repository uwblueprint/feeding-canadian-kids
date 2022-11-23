from app.graphql import schema as graphql_schema


def test_create_onboarding_request():
    query_string = """mutation testApproveOnboardingRequest{
                        approveOnboardingRequest(
                            OnboardingRequestObject:
                                {id: "5f9f1b1b9b9b9b9b9b9b9b9b",
                                info:
                                    {contactName: "Jane Doe",
                                    contactEmail: "something@gmail.com",
                                    contactPhone: "12345",
                                    role: "ASP"
                                    },
                                dateSubmitted: "2020-10-29T20:00:00.000Z",
                                status: "Pending"
                                }
                        )
                        {
                            onboardingRequest {
                            id
                            info {
                                contactName,
                                contactEmail,
                                contactPhone,
                                role
                            }
                            dateSubmitted
                            status
                            }
                        }
                        
                    }"""



    result = graphql_schema.execute(query_string)



                           
