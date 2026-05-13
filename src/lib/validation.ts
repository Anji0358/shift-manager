export const getRequiredString = (formData: FormData, key: string) => {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} は必須です。`);
  }

  return value.trim();
};

export const getOptionalString = (formData: FormData, key: string) => {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    return "";
  }

  return value.trim();
};

export const getRequiredNumber = (formData: FormData, key: string) => {
  const value = formData.get(key);
  const numberValue = Number(value);

  if (value === null || Number.isNaN(numberValue)) {
    throw new Error(`${key} は数値で入力してください。`);
  }

  return numberValue;
};

export const getPositiveNumber = (formData: FormData, key: string) => {
  const numberValue = getRequiredNumber(formData, key);

  if (numberValue <= 0) {
    throw new Error(`${key} は1以上で入力してください。`);
  }

  return numberValue;
};

export const getNonNegativeNumber = (formData: FormData, key: string) => {
  const numberValue = getRequiredNumber(formData, key);

  if (numberValue < 0) {
    throw new Error(`${key} は0以上で入力してください。`);
  }

  return numberValue;
};

export const validateTimeOrder = (startTime: string, endTime: string) => {
  if (startTime >= endTime) {
    throw new Error("開始時間は終了時間より前にしてください。");
  }
};

export const validateEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error("メールアドレスの形式が正しくありません。");
  }
};