import React from "react";

export const usePostCardDeleteModal = () => {
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  return {
    openDelete,
    handleOpenDelete,
    handleCloseDelete
  }
}

export const usePostCardEditModal = () => {
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  return {
    openEdit,
    handleOpenEdit,
    handleCloseEdit
  }
}
