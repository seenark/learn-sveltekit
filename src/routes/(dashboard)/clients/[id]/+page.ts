import { getClientById } from "$lib/stores/clientStorte";

interface Props {
  params: {
    id: string;
  };
}

export async function load({ params }: Props) {
  const id = params?.id;
  const client = await getClientById(id);
  return { client };
}
