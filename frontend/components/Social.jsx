import { useCanister, useConnect } from "@connect2ic/react";
import { resizeImage, fileToCanisterBinaryStoreFormat } from "../utils/image"
import { useDropzone } from "react-dropzone"

import React, { useEffect, useState } from "react";
import { SocialItem } from "./SocialItem";

const ImageMaxWidth = 2048

const IcpSocial = () => {
    const [social] = useCanister("social");
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState("");
    const [file, setFile] = useState(null);

    const {principal} = useConnect();

    useEffect(() => {
        refreshPosts();  // Llama a refreshPosts cuando el componente se monta
    }, []);

    /*const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: {
          "image/png": [".png"],
          "image/jpeg": [".jpg", ".jpeg"]
        },
        onDrop: async acceptedFiles => {
          if (acceptedFiles.length > 0) {
            try {
              const firstFile = acceptedFiles[0]
              const newFile = await resizeImage(firstFile, ImageMaxWidth)
              setFile(newFile)
            } catch (error) {
              console.error(error)
            }
          }
        }
    })*/

    const refreshPosts = async () => {
        setLoading("Loading...");
        try {
            const result = await social.getPosts();
            setPosts(result.sort((a, b) => parseInt(a[0]) - parseInt(b[0])));  // Ordenar posts por ID
            setLoading("Done");
            console.log(setPosts);
            consol.log(handleSubmit)
        } catch(e) {
            console.log(Error);
            setLoading("Error happened fetching posts list");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file == null) {
            return
        }

        setLoading("Loading...");
        const fileArray = await fileToCanisterBinaryStoreFormat(file)
        try
        {
        const result = await social.createPost(e.target[0].value, fileArray);
        await refreshPosts();
        setLoading("Subida completada")
        console.log("Este es el resultado: ", result)
        }
        catch(error)
        {
            console.log(error)
        }
    }

    const handleRefresh = async () => {
        await refreshPosts();
    }

    return(
        <div className="flex items-center justify-center flex-col p-4 w-full">
            <h1 className="h1 text-center border-b border-gray-500 pb-2">Hi {principal ? principal : ", connect with Internet Identity to continue"}!</h1>
            {/* Create post section */}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center border mt-4 border-gray-500 p-5 space-x-2 w-96">
                    <div className="flex flex-col space-y-2 w-full">
                        {/* <label htmlFor="message">What are you thinking about?</label> */}
                        {/* <input id="message" required className="border border-gray-500 px-2" type="text"/> */}
                    <legend class="mb-4">Datos del Paciente</legend>
                    <div class="form-group row">
                        <label class="col-sm-4 col-lg-4 col-form-label">Nombre Mascota:</label>
                        <div class="col-sm-8 col-lg-8">
                            <input type="text" id="pet" placeholder="Nombre Mascota"/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-4 col-lg-4 col-form-label">Propietario:</label>
                        <div class="col-sm-8 col-lg-8">
                            <input type="text" id="name"  placeholder="Nombre Dueño de la Mascota"/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-4 col-lg-4 col-form-label">Teléfono:</label>
                        <div class="col-sm-8 col-lg-8">
                            <input type="text" id="phnumber" placeholder="Número de Teléfono"/>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-sm-4 col-lg-4 col-form-label">Sintomas:</label>
                        <div class="col-sm-8 col-lg-8">
                            <input id="symptoms" placeholder="Ingresa los sintomas"/>
                        </div>
                    </div>
                        <button type="submit" className="w-full p-2 rounded-sm bg-gray-950 hover:bg-gray-900 text-white text-lg font-bold">Crear cita</button>
                    </div>
                    
                </div>
            </form>

            <p className="mx-2">{loading}</p>

            {/* Post section */}
            <div className="mt-4 space-y-2 w-96">
                <h2 className="h2 font-bold text-xl text-start">Registros</h2>
                <button className="w-full bg-gray-950 hover:bg-gray-900 text-white p-2 font-bold" onClick={handleRefresh}>Refresh</button>
                {posts.map((post) => {
                    return(<SocialItem key={post[0]} post={post} refresh={handleRefresh} />);
                })}
            </div>
        </div>
    )
}

export {IcpSocial}