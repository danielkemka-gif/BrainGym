"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateUsernameSuggestions } from "@/lib/usernames";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
  age: z.coerce
    .number()
    .int()
    .min(13, "Must be at least 13")
    .max(120, "Enter a valid age"),
  occupation: z.string().optional(),
});

export type BasicInfoData = z.infer<typeof schema>;

interface Props {
  defaultValues: BasicInfoData;
  onNext: (data: BasicInfoData) => void;
}

export function BasicInfoStep({ defaultValues, onNext }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BasicInfoData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const nameValue = watch("name");

  const refreshSuggestions = useCallback(() => {
    if (nameValue && nameValue.length >= 2) {
      setSuggestions(generateUsernameSuggestions(nameValue));
    }
  }, [nameValue]);

  useEffect(() => {
    refreshSuggestions();
  }, [refreshSuggestions]);

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Your name
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="e.g. Alex"
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          {...register("username")}
          placeholder="yourname"
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}

        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue("username", s, { shouldValidate: true })}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={refreshSuggestions}
              className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              ↻ New ideas
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="age" className="text-sm font-medium">
          Age
        </label>
        <input
          id="age"
          type="number"
          {...register("age")}
          placeholder="25"
          min={13}
          max={120}
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.age && (
          <p className="text-xs text-destructive">{errors.age.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="occupation" className="text-sm font-medium">
          Occupation <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="occupation"
          {...register("occupation")}
          placeholder="e.g. Software engineer"
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Continue
      </button>
    </form>
  );
}
