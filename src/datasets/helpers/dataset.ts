import { getApolloClient } from "core/helpers/apollo";
import { gql } from "@apollo/client";
import {
  CreateDatasetVersionFileMutation,
  CreateDatasetVersionFileMutationVariables,
  CreateDatasetVersionMutation,
  CreateDatasetVersionMutationVariables,
  DeleteDatasetLinkMutation,
  DeleteDatasetLinkMutationVariables,
  DeleteDatasetMutation,
  DeleteDatasetMutationVariables,
  UpdateDatasetMutation,
  UpdateDatasetMutationVariables,
} from "./dataset.generated";
import {
  CreateDatasetVersionError,
  DeleteDatasetError,
  DeleteDatasetLinkError,
} from "graphql/types";
import {
  WorkspaceDatasetFilePageQuery,
  WorkspaceDatasetFilePageQueryVariables,
} from "workspaces/graphql/queries.generated";

export async function updateDataset(
  datasetId: string,
  values: { name?: string; description?: string },
) {
  const client = getApolloClient();

  const { data } = await client.mutate<
    UpdateDatasetMutation,
    UpdateDatasetMutationVariables
  >({
    mutation: gql`
      mutation UpdateDataset($input: UpdateDatasetInput!) {
        updateDataset(input: $input) {
          dataset {
            id
            name
            description
            updatedAt
          }
          success
          errors
        }
      }
    `,
    variables: {
      input: {
        datasetId,
        name: values.name,
        description: values.description,
      },
    },
  });

  if (data?.updateDataset.success) {
    return data.updateDataset.dataset;
  } else {
    throw new Error(
      data?.updateDataset.errors?.[0] ?? "An unknown error occurred",
    );
  }
}

export async function createDatasetVersion(datasetId: string, name: string) {
  const client = getApolloClient();
  const { data } = await client.mutate<
    CreateDatasetVersionMutation,
    CreateDatasetVersionMutationVariables
  >({
    mutation: gql`
      mutation CreateDatasetVersion($input: CreateDatasetVersionInput!) {
        createDatasetVersion(input: $input) {
          version {
            id
            name
          }
          success
          errors
        }
      }
    `,
    variables: {
      input: {
        datasetId,
        name,
      },
    },
  });

  if (data?.createDatasetVersion.success) {
    await client.cache.reset();
    return data.createDatasetVersion.version!;
  } else if (
    data?.createDatasetVersion.errors.includes(
      CreateDatasetVersionError.DatasetNotFound,
    )
  ) {
    throw new Error("This dataset does not exist");
  } else if (
    data?.createDatasetVersion.errors.includes(
      CreateDatasetVersionError.PermissionDenied,
    )
  ) {
    throw new Error(
      "You do not have permission to create a version for this dataset",
    );
  } else if (
    data?.createDatasetVersion.errors.includes(
      CreateDatasetVersionError.DuplicateName,
    )
  ) {
    throw new Error("A version with this name already exists");
  } else {
    throw new Error("An unknown error occurred");
  }
}

export async function createVersionFile(
  versionId: string,
  contentType: string,
  uri: string,
) {
  const client = getApolloClient();

  const { data } = await client.mutate<
    CreateDatasetVersionFileMutation,
    CreateDatasetVersionFileMutationVariables
  >({
    mutation: gql`
      mutation CreateDatasetVersionFile(
        $input: CreateDatasetVersionFileInput!
      ) {
        createDatasetVersionFile(input: $input) {
          uploadUrl
          success
          errors
        }
      }
    `,
    variables: {
      input: {
        versionId,
        contentType,
        uri,
      },
    },
  });

  if (data?.createDatasetVersionFile.success) {
    return data.createDatasetVersionFile.uploadUrl!;
  } else {
    throw new Error("An unknown error occurred");
  }
}

export async function deleteDatasetLink(id: string) {
  const client = getApolloClient();

  const { data } = await client.mutate<
    DeleteDatasetLinkMutation,
    DeleteDatasetLinkMutationVariables
  >({
    mutation: gql`
      mutation DeleteDatasetLink($input: DeleteDatasetLinkInput!) {
        deleteDatasetLink(input: $input) {
          success
          errors
        }
      }
    `,
    variables: {
      input: {
        id,
      },
    },
    update(cache) {
      const normalizedId = cache.identify({ id, __typename: "DatasetLink" });
      cache.evict({ id: normalizedId });
      cache.gc();
    },
  });

  if (data?.deleteDatasetLink.success) {
    return true;
  } else if (
    data?.deleteDatasetLink.errors.includes(
      DeleteDatasetLinkError.PermissionDenied,
    )
  ) {
    throw new Error("You do not have permission to delete this link");
  } else if (
    data?.deleteDatasetLink.errors.includes(DeleteDatasetLinkError.NotFound)
  ) {
    throw new Error("This link does not exist");
  } else {
    throw new Error("An unknown error occurred");
  }
}

export async function deleteDataset(datasetId: string) {
  const client = getApolloClient();

  const { data } = await client.mutate<
    DeleteDatasetMutation,
    DeleteDatasetMutationVariables
  >({
    mutation: gql`
      mutation DeleteDataset($input: DeleteDatasetInput!) {
        deleteDataset(input: $input) {
          success
          errors
        }
      }
    `,
    variables: {
      input: {
        id: datasetId,
      },
    },
    update(cache) {
      cache.evict({ id: `Dataset:${datasetId}` });
      cache.gc();
    },
  });

  if (data?.deleteDataset.success) {
    return true;
  } else if (
    data?.deleteDataset.errors.includes(DeleteDatasetError.DatasetNotFound)
  ) {
    throw new Error("This dataset does not exist");
  } else if (
    data?.deleteDataset.errors.includes(DeleteDatasetError.PermissionDenied)
  ) {
    throw new Error("You do not have permission to delete this dataset");
  } else {
    throw new Error("An unknown error occurred");
  }
}

export async function getDatasetVersionFile(fileId: string) {
  const client = getApolloClient();

  const { data } = await client.query<
    WorkspaceDatasetFilePageQuery,
    WorkspaceDatasetFilePageQueryVariables
  >({
    query: gql`
      query WorkspaceDatasetFileExplorer($fileId: ID!) {
        datasetVersionFile(id: $fileId) {
          id
          uri
          filename
          createdAt
          contentType
        }
      }
    `,
    variables: { fileId: fileId },
  });

  return data.datasetVersionFile;
}
