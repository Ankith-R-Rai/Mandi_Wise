package com.mandiwise.quality.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class VisionServiceUnavailableException extends RuntimeException {

    public VisionServiceUnavailableException(String message) {
        super(message);
    }

    public VisionServiceUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
