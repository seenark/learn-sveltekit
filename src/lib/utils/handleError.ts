import { snackbar } from "$lib/stores/snackbarStore";

export type Error = {
  code: string;
  details: string;
  hint: string;
  message: string;
};

export const displayErrorMessage = (error: Error) => {
  console.error(error);
  snackbar.send({
    message: error.message,
    type: "error",
  });
};
