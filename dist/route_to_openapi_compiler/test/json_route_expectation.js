"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expected = void 0;
exports.expected = {
    "/account": {
        "post": {
            "summary": "Create an account",
            "description": "",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "object",
                                    "properties": {
                                        "firstname": {
                                            "type": "string"
                                        },
                                        "lastname": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "firstname",
                                        "lastname"
                                    ],
                                    "additionalProperties": false
                                },
                                "age": {
                                    "type": "number"
                                }
                            },
                            "required": [
                                "name",
                                "age"
                            ],
                            "additionalProperties": false
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "ok",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "id"
                                ],
                                "additionalProperties": false
                            }
                        }
                    }
                },
                "400": {
                    "description": "Must be 18 years old"
                }
            }
        }
    }
};
