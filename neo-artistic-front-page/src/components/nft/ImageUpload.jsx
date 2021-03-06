import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageUpload({ setMedia }) {
    const onDrop = useCallback(acceptedFiles => {
        let file = acceptedFiles[0];
        setMedia(file);
    }, [])
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/jpeg, image/png, image/gif',
        maxFiles: 1,
        maxSize: 10000000,
        onDrop
    });

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <p>Drag and drop some files here, or click to select files</p>
                <em>(Only *.jpeg and *.png images will be accepted)</em>
                <input {...getInputProps()} />
            </div>
        </section>
    );
}