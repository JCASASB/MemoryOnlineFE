import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { uploadPhotoToS3 } from "../../infrastructure/s3/S3PhotoUploader";
import { usePlayer } from "../hooks/usePlayer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 60px);
  padding: 20px;
  box-sizing: border-box;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
`;

const Description = styled.p`
  margin: 0;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px dashed #bbb;
  border-radius: 10px;
  background: #fafafa;
`;

const Button = styled.button`
  width: fit-content;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #333;
  color: #fff;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Status = styled.p<{ $error?: boolean }>`
  margin: 0;
  color: ${({ $error }) => ($error ? "#b00020" : "#1f7a1f")};
  font-size: 0.95rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
`;

const Preview = styled.div`
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ddd;
  background: #fff;

  img {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }
`;

export const UploadPhotos = () => {
  const { playerName } = usePlayer();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState<string[]>([]);

  const previews = useMemo(
    () => files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const onUpload = async () => {
    if (!files.length) {
      setError("Selecciona al menos una foto.");
      return;
    }

    if (!playerName.trim()) {
      setError("Necesitas iniciar sesión para subir fotos.");
      return;
    }

    setIsUploading(true);
    setError("");
    setUploaded([]);

    try {
      const results = await Promise.allSettled(
        files.map((file) => uploadPhotoToS3(playerName, file)),
      );

      const successUrls = results
        .filter((r): r is PromiseFulfilledResult<{ key: string; url: string }> => r.status === "fulfilled")
        .map((r) => r.value.url);

      const failedCount = results.filter((r) => r.status === "rejected").length;

      setUploaded(successUrls);

      if (failedCount > 0) {
        setError(`Se subieron ${successUrls.length} foto(s), pero fallaron ${failedCount}.`);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo subir las fotos.";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Subir fotos</Title>
      <Description>
        Selecciona tus imágenes para guardarlas en S3 dentro de tu carpeta de
        usuario.
      </Description>

      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
      />

      <Button type="button" onClick={onUpload} disabled={isUploading || !files.length}>
        {isUploading ? "Subiendo..." : "Subir a S3"}
      </Button>

      {error ? <Status $error>{error}</Status> : null}
      {!error && uploaded.length > 0 ? (
        <Status>Se subieron {uploaded.length} foto(s) correctamente.</Status>
      ) : null}

      <Grid>
        {previews.map((preview) => (
          <Preview key={preview.url}>
            <img src={preview.url} alt={preview.name} />
          </Preview>
        ))}
      </Grid>
    </Wrapper>
  );
};