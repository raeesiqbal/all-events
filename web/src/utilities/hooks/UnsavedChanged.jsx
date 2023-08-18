// UnsavedChangesPrompt.js
import React, { useEffect, useState } from "react";

const UnsavedChangesPrompt = ({ hasUnsavedChanges }) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleBeforeUnload = (event) => {
    if (
      unsavedChanges &&
      (window.location.pathname.includes("/post-ad") ||
        window.location.pathname.includes("/edit-ad/"))
    ) {
      event.preventDefault();
      event.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    }
  };

  useEffect(() => {
    if (hasUnsavedChanges()) {
      setUnsavedChanges(true);
      window.onbeforeunload = handleBeforeUnload;
    } else {
      setUnsavedChanges(false);
      window.onbeforeunload = null;
    }
  }, [hasUnsavedChanges]);

  return null;
};

export default UnsavedChangesPrompt;
