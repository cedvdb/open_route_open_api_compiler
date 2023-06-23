export declare const expected: {
    "/account": {
        post: {
            summary: string;
            description: string;
            requestBody: {
                required: boolean;
                content: {
                    "application/json": {
                        schema: {
                            type: string;
                            properties: {
                                name: {
                                    type: string;
                                    properties: {
                                        firstname: {
                                            type: string;
                                        };
                                        lastname: {
                                            type: string;
                                        };
                                    };
                                    required: string[];
                                    additionalProperties: boolean;
                                };
                                age: {
                                    type: string;
                                };
                            };
                            required: string[];
                            additionalProperties: boolean;
                        };
                    };
                };
            };
            responses: {
                "200": {
                    description: string;
                    content: {
                        "application/json": {
                            schema: {
                                type: string;
                                properties: {
                                    id: {
                                        type: string;
                                    };
                                };
                                required: string[];
                                additionalProperties: boolean;
                            };
                        };
                    };
                };
                "400": {
                    description: string;
                };
            };
        };
    };
};
