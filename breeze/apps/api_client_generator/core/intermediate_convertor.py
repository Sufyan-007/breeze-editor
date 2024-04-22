from ..api_models import Request,Response,KeyValue,Url,Body,Parameter,Auth
from ..api_models import Formdata,AuthContent
from ..api_models import MethodsEnum,StatusEnum,ContentEnum,AuthTypeEnum,ModeEnum


class IntermediateConversion:
    def __init__(self):
        pass

    def create_request(self, request_data):
        if isinstance(request_data, str):
            method = MethodsEnum.GET
            auth = None
            headers = []
            parameters = []
            url = Url(baseurl=request_data, host='',
                      protocol='', port=0, path='')
            body = None
            request_obj = Request(method, auth, headers, parameters, url, body)
            return request_obj

        else:
            # Build Request Object
            method_name = request_data.get("method")
            method = MethodsEnum[method_name.upper()]

            auth_data = request_data.get("auth")

            # call to auth data creation
            if auth_data:
                auth = self._create_auth(auth_data=auth_data)
            else:
                auth = auth_data

            # handle headers
            headers = []
            header_data = request_data.get("header", [])
            if header_data:
                headers = self._create_headers(header_data=header_data)

            # call to url data creation and parameters creation
            url_data = request_data.get("url", '')
            url = []
            parameters = []
            if url_data:
                url = self._create_url(url_data=url_data)
                parameters = self._create_parameters(url_data=url_data)

            # call to body creation
            body = []
            if request_data.get("body"):
                body_data = request_data.get("body")
                body = self._create_body(body_data=body_data)

            request_obj = Request(method, auth, headers, parameters, url, body)
            return request_obj

    def create_response(self, response_data):
        if response_data:
            status = StatusEnum[response_data.get("status").upper()]
            content_type = ContentEnum[response_data.get(
                "content_type").upper()]
            response = Response(
                status,
                content_type,
                response_data.get("schema_name"),
                response_data.get("raw_content"),
                response_data.get("file"))
        else:
            response = []
        return response

    def _create_auth(self, auth_data):
        auth_type = AuthTypeEnum[auth_data.get("type").upper()]
        content_data = auth_data.get(auth_data.get("type"),auth_data.get("content"))
        login_api = auth_data.get("login_api",None)
        token_api = auth_data.get("token_api",None)
        auth_content = []
        if content_data:
            auth_content.append(
                AuthContent(
                    key=content_data[0].get("key"),
                    value=content_data[0].get("value"),
                    type=content_data[0].get("type")
                )
            )
        auth = Auth(type=auth_type, content=auth_content,token_api=token_api,login_api=login_api)
        return auth

    def _create_parameters(self, url_data):
        query_parameters = url_data.get("query", [])
        parameters = [
            Parameter(param_in="query", name=param.get("key"),
                      type="string", required=True, description="")
            for param in query_parameters
        ]
        return parameters

    def _create_url(self, url_data):
        url = Url(
            baseurl=url_data.get("baseurl"),
            host=url_data.get("host"),
            protocol=url_data.get("protocol", ""),
            port=url_data.get("port", 0),
            path=url_data.get("path")
        )
        return url

    def _create_body(self, body_data):
        formdata_list = []
        formdata_data = body_data.get("formdata", [])

        for item in formdata_data:
            formdata_list.append(Formdata(key=item.get("key"), value=item.get(
                "value"), description=item.get("description"), type=item.get("type"), src=item.get("src")))

        content_type = body_data.get("content_type")
        if content_type:
            content_type = ContentEnum[content_type.upper()]

        body = Body(
            mode=ModeEnum[body_data.get("mode").upper()],
            raw_content=body_data.get("raw"),
            formdata=formdata_list,
            content_type=content_type,
            required=body_data.get("required"),
            schema_name=body_data.get("schema_name"),
            file=body_data.get("file"))
        return body

    def _create_headers(self, header_data):
        headers = []
        for item in header_data:
            headers.append(KeyValue(key=item.get(
                "key"), value=item.get("value")))
        return headers

