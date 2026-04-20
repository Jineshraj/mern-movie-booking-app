import React from "react";
import { X } from "lucide-react";

export const namedUploaderStyles = {
  container: "bg-[#111] border border-white/10 p-4 rounded-xl",
  title: "text-sm text-white font-bold tracking-widest uppercase mb-4",
  grid: "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  item: "bg-[#161616] border border-white/5 rounded-xl p-3 relative group transition-colors hover:border-white/20",
  preview: "w-full h-24 object-cover rounded-lg mb-3 shadow-lg shadow-black",
  placeholder: "w-full h-24 bg-white/5 rounded-lg mb-3 flex items-center justify-center border border-white/10",
  placeholderIcon: "text-gray-600 font-bold text-2xl",
  inputContainer: "flex flex-col gap-1.5",
  input: "w-full bg-[#111] border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors",
  removeButton: "absolute -top-2 -right-2 bg-red-600 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10",
  removeIcon: "w-3 h-3",
  uploadLabel: "flex items-center justify-center p-3 border-2 border-dashed border-white/10 rounded-lg text-gray-500 flex-col gap-2 cursor-pointer hover:bg-white/5 hover:border-red-500/30 transition-all",
  uploadText: "text-xs font-semibold uppercase",
  uploadInput: "hidden",
};

export function NamedUploader({ title, onFiles, items, remove, updateName, updateRole, icon, onAddEmpty, onUpdateImage }) {
  return (
    <div className={namedUploaderStyles.container}>
      <h3 className={namedUploaderStyles.title}>{title}</h3>
      <div className={namedUploaderStyles.grid}>
        {items.map((it, i) => (
          <div key={i} className={namedUploaderStyles.item}>
            {it.preview ? (
              <img src={it.preview} className={namedUploaderStyles.preview} alt="preview" />
            ) : (
              <label className={`${namedUploaderStyles.placeholder} cursor-pointer hover:border-red-500/50 transition-colors`}>
                {icon ? icon : <div className={namedUploaderStyles.placeholderIcon}>?</div>}
                {onUpdateImage && (
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpdateImage(i, e.target.files[0])} />
                )}
              </label>
            )}
            <div className={namedUploaderStyles.inputContainer}>
              <input
                value={it.name || ""}
                onChange={(e) => updateName(i, e.target.value)}
                placeholder="Name"
                className={namedUploaderStyles.input}
              />
              {updateRole && (
                <input
                   value={it.role || ""}
                   onChange={(e) => updateRole(i, e.target.value)}
                   placeholder="Role"
                   className={`${namedUploaderStyles.input} mt-1`}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className={namedUploaderStyles.removeButton}
            >
              <X className={namedUploaderStyles.removeIcon} />
            </button>
          </div>
        ))}
        <label className={namedUploaderStyles.uploadLabel}>
          {icon}
          <span className={namedUploaderStyles.uploadText}>Upload Files</span>
          <input type="file" multiple accept="image/*" onChange={onFiles} className={namedUploaderStyles.uploadInput} />
        </label>
        {onAddEmpty && (
          <button type="button" onClick={onAddEmpty} className={namedUploaderStyles.uploadLabel}>
            <span className={namedUploaderStyles.placeholderIcon}>+</span>
            <span className={namedUploaderStyles.uploadText}>Add Person</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function Uploader({ title, onFiles, items, remove, updateMeta, icon, onAddEmpty, onUpdateImage }) {
  return (
    <div className={namedUploaderStyles.container}>
      <h3 className={namedUploaderStyles.title}>{title}</h3>
      <div className={namedUploaderStyles.grid}>
        {items.map((it, i) => (
          <div key={i} className={namedUploaderStyles.item}>
            {it.preview ? (
              <img src={it.preview} className={namedUploaderStyles.preview} alt="preview" />
            ) : (
              <label className={`${namedUploaderStyles.placeholder} cursor-pointer hover:border-red-500/50 transition-colors title="Click to add image"`}>
                {icon ? icon : <div className={namedUploaderStyles.placeholderIcon}>?</div>}
                {onUpdateImage && (
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => onUpdateImage(i, e.target.files[0])} />
                )}
              </label>
            )}
            <div className={namedUploaderStyles.inputContainer}>
              {it.role !== undefined ? (
                <>
                  <input
                    value={it.name || ""}
                    onChange={(e) => updateMeta(i, "name", e.target.value)}
                    placeholder="Name"
                    className={namedUploaderStyles.input}
                  />
                  <input
                     value={it.role || ""}
                     onChange={(e) => updateMeta(i, "role", e.target.value)}
                     placeholder="Role"
                     className={`${namedUploaderStyles.input} mt-1`}
                  />
                </>
              ) : (
                <input
                  value={it.name || ""}
                  onChange={(e) => updateMeta(i, "name", e.target.value)}
                  placeholder="Name"
                  className={namedUploaderStyles.input}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className={namedUploaderStyles.removeButton}
            >
              <X className={namedUploaderStyles.removeIcon} />
            </button>
          </div>
        ))}
        <label className={namedUploaderStyles.uploadLabel}>
          {icon}
          <span className={namedUploaderStyles.uploadText}>Upload Files</span>
          <input type="file" multiple accept="image/*" onChange={onFiles} className={namedUploaderStyles.uploadInput} />
        </label>
        {onAddEmpty && (
          <button type="button" onClick={onAddEmpty} className={namedUploaderStyles.uploadLabel}>
            <span className={namedUploaderStyles.placeholderIcon}>+</span>
            <span className={namedUploaderStyles.uploadText}>Add Person</span>
          </button>
        )}
      </div>
    </div>
  );
}
