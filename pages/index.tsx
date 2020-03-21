import * as React from 'react';
import { Checkbox, TextInput, Heading, Card, Pane, Text } from "evergreen-ui";
import XLSX from "xlsx";
import { Router, useRouter } from "next/router";
import { set } from "../src/state";


export default () => {
    const router = useRouter()

    const dropZoneDragover = (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    const dropZoneDrop = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length !== 1) {
            console.log("Too many files");
        }

        const file = files[0];
        if (file.type.match(/.*sheet/)) {
            readExcel(file, makeGraph);
        } else {
            console.log("Wrong file type");
        }
    }

    const readExcel = (file, callback) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames
                .find(function(name) { return name === "DS LOP" });
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            callback(json);
        }

        reader.onerror = function(ex) {
            console.log(ex)
        };

        reader.readAsBinaryString(file)
    };

    const makeGraph = (excelObject) => {
        const graph = {};
        excelObject.forEach((object) => {
            const clusterName = object["Cluster name"];
            const dataName = object["Data name"];
            if (clusterName == undefined
                    || dataName == undefined
                    || dataName === ""
                    || dataName === " ") {
                return;
            }
            if (clusterName in graph) {
                graph[clusterName].push(dataName);
            } else {
                graph[clusterName] = [dataName];
            }
        });

        const elements = [];
        Object.keys(graph).forEach(function(clusterName) {
            elements.push({ data: { id: clusterName }});
            graph[clusterName].forEach(function(dataName) {
                elements.push({ data: { id: dataName }});
                elements.push({ data: { id: clusterName + dataName, source: clusterName, target: dataName }});
            })
        })

        set(elements);
        router.push("/graph");
    }

    return (
        <Pane display="flex" flexDirection="row">
            <Card>
                <div id="dropZone" onDragOver={dropZoneDragover} onDrop={dropZoneDrop}/>
            </Card>
        </Pane>
        )
}
