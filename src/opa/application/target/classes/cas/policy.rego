package envoy.authz

import input.attributes.request.http as http_request

default allow = false

token = {"payload": payload} {
    [_, encoded] := split(http_request.headers.authorization, " ")
    [_, payload, _] := io.jwt.decode(encoded)
}

allow {
    input.attributes.source.principal == data.service2service[token.payload.zone_uuid][input.attributes.destination.principal][_]
} {
    http_request.path == "/v1/data/service2service"
}

svc_spiffe_id = client_id {
    [_, _, uri_type_san] := split(http_request.headers["x-forwarded-client-cert"], ";")
    [_, client_id] := split(uri_type_san, "=")
}

action_allowed {
  token.payload.email == "christian.lahmer@sap.com"
}