from app.graphql import schema as graphql_schema


def test_create_onboarding_request():
    query_string = """mutation testApproveOnboardingRequest{
                        approveOnboardingRequest(OnboardingRequestID: "1"){
                            onboardingRequest{
                                id
                            }
                        }
                    }"""
                    
                    
                    



    result = graphql_schema.execute(query_string)



                           
