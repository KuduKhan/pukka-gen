export type ProjectBriefPayload = {
  name: string; email: string; phone: string; service: string; message: string; website: string;
};
export function readProjectBriefForm(form: HTMLFormElement): ProjectBriefPayload {
  const fields = new FormData(form);
  const value = (key: string): string => String(fields.get(key) ?? "").trim();
  return { name: value("name"), email: value("email"), phone: value("phone"),
    service: value("service"), message: value("message"), website: value("website") };
}
