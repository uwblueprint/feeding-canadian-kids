import os


def get_fe_url():
    url = os.getenv("FRONTEND_URL")

    if url is None:
        raise Exception("Frontend URL is not set in the environment file!")
    return url
