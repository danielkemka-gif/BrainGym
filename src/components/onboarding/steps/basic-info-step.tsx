"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateUsernameSuggestions } from "@/lib/usernames";
import { Camera, X } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
  gender: z.string().min(1, "Please select a gender"),
  age: z.coerce
    .number()
    .int()
    .min(13, "Must be at least 13")
    .max(120, "Enter a valid age"),
  occupation: z.string().optional(),
});

export type BasicInfoData = z.infer<typeof schema> & { avatar_url?: string };

interface Props {
  defaultValues: BasicInfoData;
  onNext: (data: BasicInfoData) => void;
}

export function BasicInfoStep({ defaultValues, onNext }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    defaultValues.avatar_url ?? null
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB");
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await compressImage(file);
      setAvatarUrl(dataUrl);
    } catch {
      alert("Could not process image. Please try another.");
    } finally {
      setUploading(false);
    }
  }

  function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = 200;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("No canvas context"));

          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function handleRemoveAvatar() {
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFormSubmit(data: BasicInfoData) {
    onNext({ ...data, avatar_url: avatarUrl ?? undefined });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="flex justify-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/50 hover:bg-accent"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            ) : uploading ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Camera className="h-8 w-8 text-muted-foreground" />
            )}
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Add a profile picture <span className="text-muted-foreground">(optional)</span>
      </p>

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
        <label className="text-sm font-medium">Gender</label>
        <div className="grid grid-cols-3 gap-2">
          {["male", "female", "other"].map((g) => (
            <label
              key={g}
              className={`flex cursor-pointer items-center justify-center rounded-lg border border-border px-3 py-2.5 text-sm transition-colors ${
                watch("gender") === g
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              <input
                type="radio"
                value={g}
                {...register("gender")}
                className="sr-only"
              />
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="text-xs text-destructive">{errors.gender.message}</p>
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
