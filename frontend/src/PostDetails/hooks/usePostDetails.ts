import React from "react";

export const useCommentCardCreateModal = () => {
  const [openCreate, setOpenCreate] = React.useState(false);

  const handleOpenCreate = () => setOpenCreate(true);

  const handleCloseCreate = () => setOpenCreate(false);

  return {
    openCreate,
    handleOpenCreate,
    handleCloseCreate
  }
}