
def set_response_status(status):
    if status == 200 or  status == "200":
        status = "S_200"
    elif status == 201 or  status == "201":
        status = "S_201"
    elif status == 403 or  status == "403":
        status = "S_403"
    elif status == 500 or  status == "500":
        status = "S_500"
    elif status == 400 or  status == "400":
        status = "S_400"
    elif status == 404 or  status == "404":
        status = "S_404"
    else:
        status = "S_200"
    return status