from app.graphql import schema as graphql_schema


def test_create_onboarding_request():
    query_string = """
  mutation testApproveOnboardingRequest {
  approveOnboardingRequest(id: "6386aabd764fc493d1064840") {
    onboardingRequest {
      id
      status
      info {
        contactName,
        contactEmail,
        contactPhone, 
      }
      userUid
    }
  }
}
"""
                    
                    
                    



    result = graphql_schema.execute(query_string)



                           
