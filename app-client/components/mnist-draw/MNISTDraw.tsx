'use client'
import { Modal } from 'flowbite-react'
import { useState, useEffect, FC, ReactNode as RN } from 'react'
import './MNIST.css'
import './App.css'
import { Button } from '@/components/button/Button'
import { CodeBlock, dracula } from 'react-code-blocks'
// import styles from '../../app/styles.module.scss'
import Spacer from '@/components/spacer/Spacer'
import ThreeColumns from  '@/components/three-columns/ThreeColumns'
import StepTitle from '@/components/step-title/StepTitle'
import SubTitle from '@/components/sub-title/SubTitle'
import Title from '@/components/title/Title'
// import BarGraph from '../bargraph/BarGraph'; // Adjust the path as necessary
import { stringify } from 'json-bigint'
import apiGetPrjId from '@/lib/api/ApiGetPrjId'
import apiPostLoadInputJson from '@/lib/api/ApiPostLoadInputJson'
import apiGetDownloadWitnessJson from '@/lib/api/ApiGetDownloadWitnessJson'
import apiGetDownloadAboutProjectTxt from '@/lib/api/ApiGetDownloadAboutProjectTxt'
import apiPostLoadAboutTxt from '@/lib/api/ApiPostLoadAboutTxt'
import apiGetDownloadProofJson from '@/lib/api/ApiGetDownloadProofJson'
import apiPostVerify from '@/lib/api/ApiPostVerify'

const toKb = (num: number): string => (num / 1024 ).toFixed(2) + 'KB'

const size = 28
const MNISTSIZE = 784

interface IMNISTBoardProps {
    grid: number[][]
    onChange: (row: number, col: number) => void
}

const MNISTBoard: FC<IMNISTBoardProps> = ({ grid, onChange }) => {
    const [mouseDown, setMouseDown] = useState(false)

    const GridSquare = (row: number, col: number) => {
        const handleChange = () => {
            if (mouseDown) {
                onChange(row, col);
            }
        };

        const handleInteractionStart = () => {
            setMouseDown(true);
            onChange(row, col);
        };

        const handleInteractionEnd = () => {
            setMouseDown(false);
        };

        return (
            <div
                className={`square ${grid[row][col] ? 'on' : 'off'}`}
                onMouseEnter={handleChange}
                onMouseDown={handleInteractionStart}
                onMouseUp={handleInteractionEnd}
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleInteractionEnd}
            />
        );
    };

    const renderCol = (col: number) => {
        const mycol = []
        for (let row = 0; row < size; row++) {
            mycol.push(<div key={`row-${row}`}>{GridSquare(row, col)}</div>)
        }
        return <div key={`col-${col}`}>{mycol}</div>
    }

    const RenderGrid = () => {
        const mygrid = []
        for (let i = 0; i < size; i++) {
            mygrid.push(renderCol(i))
        }
        return mygrid
    }

    return (
        <div className="sm:my-2 md:my-8 lg:my-10">
            <div className='MNISTPage'>
                <div className='MNISTBoard'>
                    <div className='centerObject'>
                        <div className='grid'>{RenderGrid()}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const MNISTSection: FC<{ children: RN }> = ({ children }) => {
    return (
        <div className="sm:mt-4 lg:mt-8 mx-auto">
            {children}
        </div>
    )
}

export function MNISTDraw() {
    const [openModal, setOpenModal] = useState<string | undefined>()
    const props = { openModal, setOpenModal }
    // const [verifyResult, setVerifyResult] = useState<boolean | null>(null)

    const [inputtedJson, setInputtedJson] = useState<any | null>(null)
    const [predictedDigit, setPredictedDigit] = useState<number>(-1)
    const [witnessJson, setWitnessJson] = useState<any | null>(null)
    const [aboutTxt, setAboutTxt] = useState<boolean>(false)
    const [proofJson, setProofJson] = useState<any | null>(null)
    const [verificationJson, setVerificationJson] = useState<any | null>(null)

    const [witnessDone, setWitnessDone] = useState<boolean>(false)
    const [proofDone, setProofDone] = useState<boolean>(false)
    const [verificationDone, setVerificationDone] = useState<boolean>(false)

    const [id, setId] = useState<string>('')

    const [loading, setLoading] = useState<boolean>(false)

    const [grid, setGrid] = useState<number[][]>(
        Array(size)
            .fill(null)
            .map(() => Array(size).fill(0))
    ) // initialize to a 28x28 array of 0's

    useEffect(() => {
        (async () => {
            // doReset();
        })()
    }, [])

    async function doReset() {
        const resetImage = () => {
            var newArray = Array(size)
                .fill(null)
                .map((_) => Array(size).fill(0))
            setGrid(newArray)
        }
        resetImage()
        setInputtedJson(null)
        if (id) await apiPostLoadInputJson(id, JSON.stringify({}))
        setPredictedDigit(-1)
        setWitnessJson(null)
        setProofJson(null)
        setVerificationJson(null)
        setWitnessDone(false)
        setProofDone(false)
        setVerificationDone(false)
        // setId('')
        setLoading(false)
    }

    async function doSendAndReqPred() {
        // get image from grid
        let imgTensor: number[] = Array(MNISTSIZE).fill(0);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                imgTensor[i * size + j] = grid[i][j];
            }
        }

        const inputFile = JSON.stringify({ input_data: [imgTensor] });
        setInputtedJson({ input_data: [imgTensor] });
        const imgClean = imgTensor.map(e => e * 2 > 0.1 ? 1 : 0);
        let lines = '';
        for (let i = 0; i < size; i++) lines += imgClean.slice(i * size, i * size + size).join('') + '\n';
        console.log(lines);
        
        setLoading(true)
        try {
            const idOfFirstPrj = await apiGetPrjId();
            setId(idOfFirstPrj);

            await apiPostLoadInputJson(idOfFirstPrj, inputFile);
        } catch (error) {
            alert(error);
        }
        setLoading(false);
    }

    function handleSetSquare(myrow: number, mycol: number) {
        var newArray = []
        for (var i = 0; i < grid.length; i++) newArray[i] = grid[i].slice()
        newArray[myrow][mycol] = 1
        setGrid(newArray)
    }

    async function doRetrieveWitness() {
        setLoading(true)
        try {
            const witnessData = await apiGetDownloadWitnessJson(id)
            setWitnessJson(witnessData)
            const resultsRaw = witnessData?.pretty_elements?.rescaled_outputs[0]
            const results = resultsRaw.map(parseFloat)
            const digit = results.indexOf(Math.max(...results))
            setPredictedDigit(digit)
            setWitnessDone(true)
        } catch (error) {
            alert(error);
        }
        setLoading(false)
    }

    async function doReqProofOfInf() {
        setLoading(true)
        try {
            let aboutObj = await apiGetDownloadAboutProjectTxt(id)
            await apiPostLoadAboutTxt(id, aboutObj.name)
            setAboutTxt(true)
        } catch (error) {
            alert(error)
        }
        setLoading(false)
    }

    async function doRetrieveProof() {
        setLoading(true)
        try {
            const proofObject = await apiGetDownloadProofJson(id);
            setProofJson(proofObject);
            setProofDone(true);
        } catch (error) {
            alert(error)
        }
        setLoading(false)
    }

    async function doVerify() {
        setLoading(true)
        try {
            const verificationResult = await apiPostVerify(id, );
            setVerificationJson(verificationResult);
            setVerificationDone(true);
        } catch (error) {
            alert(error)
        }
        setLoading(false)
    }

    function SendAndReqPredButton() {
        return (
            <Button
                className="bg-white hover:bg-blue-50 disabled:bg-opacity-20 w-full p-3 rounded text-black"
                text="Send and Request Prediction"
                disabled={loading}
                loading={loading}
                loadingText='Sending...'
                onClick={doSendAndReqPred}
            >
            {/*
            <Button
                // className={styles.button}
                className="text-red"
                text='Classify & Prove'
                // loading={generatingProof}
                loading={false}
                loadingText='Proving...'
                onClick={doProof}
            />
            */}
            </Button>
        )
    }

    function ResetButton() {
        return (
            <Button
                className="bg-white hover:bg-blue-50 w-full p-3 rounded text-black"
                onClick={doReset}
                text='RESET'
            />
        )
    }

    function RetrieveWitnessButton() {
        return <Button
            className="bg-white hover:bg-blue-50 disabled:bg-opacity-20 w-full p-3 rounded text-black"
            text={'\u27F3'}
            disabled={loading}
            loadingText={'…'}
            onClick={doRetrieveWitness}
        />
    }

    function ReqProofOfInfButton() {
        return <Button
            className="bg-white hover:bg-blue-50 disabled:bg-opacity-20 w-full p-3 rounded text-black"
            text={'Request Proof of Inference'}
            disabled={loading}
            loading={loading}
            loadingText={'…'}
            onClick={doReqProofOfInf}
        />
    }

    function WitnessBlock() {
        return (
            <>
                <Button
                    className="bg-white w-full text-center p-3 rounded text-black"
                    text={`Result: ${predictedDigit} (show details)`}
                    onClick={() => props.setOpenModal('WitnessJson')}
                />
                <Modal
                    show={props.openModal === 'WitnessJson'}
                    onClose={() => props.setOpenModal(undefined)}
                >
                    <Modal.Header>Details for witness.json file: </Modal.Header>
                    <Modal.Body className='bg-black'>
                        <div className='mt-4 p-4 bg-black-100 rounded'>
                            <pre className="blackspace-pre-wrap text-xs">
                                <CodeBlock
                                    text={stringify(witnessJson, null, 6)}
                                    showLineNumbers={false}
                                    language="json"
                                    theme={dracula}
                                />
                            </pre>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }

    function RetrieveProofButton() {
        return <Button
            className="bg-white w-full text-center p-3 rounded text-black"
            text={"\u27F3"}
            disabled={loading}
            loading={loading}
            loadingText={'…'}
            onClick={doRetrieveProof}
        />
    }

    function ProofBlock() {
        return (
            <>
                <Button
                    className="bg-white w-full text-center p-3 rounded text-black"
                    text={`Result: ${toKb(JSON.stringify(proofJson).length)} (show file)`}
                    onClick={() => props.setOpenModal('ProofJson')}
                />
                <Modal
                    show={props.openModal === 'ProofJson'}
                    onClose={() => props.setOpenModal(undefined)}
                >
                    <Modal.Header>Details for proof.json file: </Modal.Header>
                    <Modal.Body className='bg-black'>
                        <div className='mt-4 p-4 bg-black-100 rounded'>
                            <pre className='blackspace-pre-wrap'>
                                <CodeBlock
                                    text={stringify(proofJson, null, 6)}
                                    showLineNumbers={false}
                                    language="json"
                                    theme={dracula}
                                />
                            </pre>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }

    function VerifyButton() {
        return <Button
            className="bg-white w-full text-center p-3 rounded text-black"
            text="Verify Proof"
            disabled={loading}
            loading={loading}
            loadingText={'…'}
            onClick={doVerify}
        />
    }

    function VerifyTrueBlock() {
        return <>
            <Button
                className="w-full py-3 text-center text-green-400 font-semibold"
                text="OK"
                onClick={() => props.setOpenModal('VerifyTrue')}
            />
            <Modal
                show={props.openModal === 'VerifyTrue'}
                onClose={() => props.setOpenModal(undefined)}
            >
                <Modal.Header>Details for verification: </Modal.Header>
                <Modal.Body className='bg-black'>
                    <div className='mt-4 p-4 bg-black-100 rounded'>
                        <pre className='blackspace-pre-wrap'>
                            <CodeBlock
                                text={stringify(verificationJson, null, 6)}
                                showLineNumbers={false}
                                language="json"
                                theme={dracula}
                            />
                        </pre>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    }

    function VerifyFailedBlock() {
        return <>
            <Button
                className="w-full py-3 text-center text-red-700 font-semibold"
                text="FAILED"
                onClick={() => props.setOpenModal('VerifyFailed')}
            />
            <Modal
                show={props.openModal === 'VerifyFailed'}
                onClose={() => props.setOpenModal(undefined)}
            >
                <Modal.Header>Details for verification: </Modal.Header>
                <Modal.Body className='bg-black'>
                    <div className='mt-4 p-4 bg-black-100 rounded'>
                        <pre className='blackspace-pre-wrap'>
                            <CodeBlock
                                text={stringify(verificationJson, null, 6)}
                                showLineNumbers={false}
                                language="json"
                                theme={dracula}
                            />
                        </pre>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    }

    function ResetButtonWrapper({ children }: { children: RN }) {
        return (
            <div className="flex flex-row gap-0">
                <div className="max-sm:hidden sm:hidden md:block p-2 md:w-1/3 lg:block lg:w-5/12">&nbsp;</div>
                <div className="max-sm:block max-sm:w-full sm:w-full p-2 md:w-1/3 lg:w-2/12">
                    {children}
                </div>
                <div className="max-sm:hidden sm:hidden md:block p-2 md:w-1/3 lg:block lg:w-5/12">&nbsp;</div>
            </div>
        )
    }

    return (
        <>

            <MNISTSection>

                <Title>Client Dashboard (draw and classify / recognise a digit)</Title>

                <MNISTBoard grid={grid} onChange={(r, c) => handleSetSquare(r, c)} />

            </MNISTSection>

            <MNISTSection>

                <SubTitle>Steps to Classify, Prove, Verify:</SubTitle>

                <StepTitle>STEP 1: Classify</StepTitle>

                <ThreeColumns
                    left={<SendAndReqPredButton />}
                    center={<RetrieveWitnessButton />}
                    right={witnessDone ? <WitnessBlock /> : <></>}
                />

                <Spacer />

                <StepTitle>STEP 2: Prove Inference</StepTitle>

                <ThreeColumns
                    left={<ReqProofOfInfButton />}
                    center={<RetrieveProofButton />}
                    right={proofDone ? <ProofBlock /> : <></>}
                />

                <Spacer />

                <StepTitle>Step 3: Verify Proof</StepTitle>

                <ThreeColumns
                    left={<VerifyButton />}
                    center={<>{(verificationDone && verificationJson?.verification_result) && <VerifyTrueBlock />}</>}
                    right={<>{(verificationDone && !verificationJson?.verification_result) && <VerifyFailedBlock />}</>}
                />

                <Spacer />

                <ResetButtonWrapper>
                    <ResetButton />
                </ResetButtonWrapper>

            </MNISTSection>

        </>
    )
}
