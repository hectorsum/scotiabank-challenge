package com.periferia.solicitudes.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class EnumValidator implements ConstraintValidator<ValidEnum, String> {

    private List<String> acceptedValues;

    @Override
    public void initialize(ValidEnum annotation) {
        acceptedValues = Arrays.stream(annotation.enumClass().getEnumConstants())
                .flatMap(e -> {
                    try {
                        Method getLabel = e.getClass().getMethod("getLabel");
                        String label = (String) getLabel.invoke(e);
                        return Stream.of(((Enum<?>) e).name().toLowerCase(), label.toLowerCase());
                    } catch (Exception ex) {
                        return Stream.of(((Enum<?>) e).name().toLowerCase());
                    }
                })
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) return true; // @NotBlank handles null/blank
        return acceptedValues.contains(value.toLowerCase());
    }
}
