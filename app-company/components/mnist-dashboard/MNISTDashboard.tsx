'use client'
import { Modal } from 'flowbite-react'
import { useState, ReactNode as RN } from 'react'
import { Button } from '@/components/button/Button'
import Spacer from '@/components/spacer/Spacer'
import CenteredButtonWrapper from '@/components/centered-button-wrapper/CenteredButtonWrapper'
import TwoRows from '@/components/two-rows/TwoRows'
import TwoColumns from '@/components/two-columns/TwoColumns'
import CenteredSubTitle from '@/components/centered-sub-title/CenteredSubTitle'
import SubTitle from '@/components/sub-title/SubTitle'
import Title from '@/components/title/Title'
import Section from '@/components/section/Section'
import apiGetPrjId from '@/lib/api/ApiGetPrjId'
import apiGetPrjFiles from '@/lib/api/ApiGetPrjFiles'
import apiPostGenWitnessGood from '@/lib/api/ApiPostGenWitnessGood'
import apiGetDownloadAboutProjectTxt from '@/lib/api/ApiGetDownloadAboutProjectTxt'
import apiPostGenProofGood from '@/lib/api/ApiPostGenProofGood'
import apiPostGenWitnessBad from '@/lib/api/ApiPostGenWitnessBad'
import apiPostGenProofBad from '@/lib/api/ApiPostGenProofBad'
import apiPostLoadWitnessGoodJson from '@/lib/api/ApiPostLoadWitnessGoodJson'
import apiPostLoadWitnessBadJson from '@/lib/api/ApiPostLoadWitnessBadJson'
import apiPostLoadProofJson from '@/lib/api/ApiPostLoadProofJson'

const toMb = (num: number): string => (num / 1024 / 1024).toFixed(2) + 'MB'

export default function MNISTDashboard() {
    const [openModal, setOpenModal] = useState<string | undefined>()
    const props = { openModal, setOpenModal }

    const [models, setModels] = useState<any[] | null>(null)

    const [jsons, setJsons] = useState<any[] | null>(null)
    const [inputDone, setInputDone] = useState<boolean>(false)
    const [witnessDone, setWitnessDone] = useState<boolean>(false)
    const [witnessBadDone, setWitnessBadDone] = useState<boolean>(false)
    const [proofDone, proofInputDone] = useState<boolean>(false)
    const [proofBadDone, proofInputBadDone] = useState<boolean>(false)

    const [id, setId] = useState<string>('')

    const [loading, setLoading] = useState<boolean>(false)

    async function doReset() {
        setModels(null)
        setJsons(null)
        setInputDone(false)
        setWitnessDone(false)
        setWitnessBadDone(false)
        proofInputDone(false)
        proofInputBadDone(false)
        if (id) {
            await apiPostLoadWitnessGoodJson(id, JSON.stringify({}))
            await apiPostLoadWitnessBadJson(id, JSON.stringify({}))
            await apiPostLoadProofJson(id, JSON.stringify({}))
        }
    }

    async function doRetrieveUserData() {
        setLoading(true)
        try {
            const idOfFirstPrj = await apiGetPrjId();
            setId(idOfFirstPrj);

            const fArr = await apiGetPrjFiles(idOfFirstPrj);
            const mArr = fArr
                .filter(({ name: n }: any) => {
                    return n === 'network_good.ezkl' || n === 'network_bad.ezkl'
                });
            setModels(mArr.sort().reverse());

            const jArr = fArr
                .filter(({ name: n }: any) => {
                    return n === 'input.json' || n === 'witness.json' || n === 'proof.json';
                });
            setJsons(jArr.sort());
            if (jArr.find(({ name }: any) => name === 'input.json')) setInputDone(true);
            if (jArr.find(({ name }: any) => name === 'witness.json')) setWitnessDone(true);
            if (jArr.find(({ name }: any) => name === 'proof.json')) proofInputDone(true);
        } catch (error) {
            alert(error);
        }
        setLoading(false)
    }

    async function doGenWitness( ) {
        setLoading(true)
        try {
            await apiPostGenWitnessGood(id);
            setWitnessDone(true);
        } catch (error) {
            alert(error);
        }
        setLoading(false)
    }

    async function doGenProof() {
        setLoading(true);
        try {
            const aboutTxt = await apiGetDownloadAboutProjectTxt(id);
            if (aboutTxt.request === undefined || !aboutTxt.request) {
                throw new Error('ProofNotRequestedByClient');
            }
            await apiPostGenProofGood(id);
         } catch (error)  {
             alert(error);
         }
         setLoading(false);
    }

    async function doGenWitnessBad() {
        setLoading(true);
        try {
            await apiPostGenWitnessBad(id);
            setWitnessBadDone(true);
        } catch (error) {
            alert(error);
        }
        setLoading(false);
    }

    async function doGenProofBad() {
        setLoading(true);
        try {
            const aboutTxt = await apiGetDownloadAboutProjectTxt(id);
            if (aboutTxt.request === undefined || !aboutTxt.request) {
                throw new Error('ProofNotRequestedByClient');
            }
            await apiPostGenProofBad(id);
        } catch (error) {
            alert(error);
        }
        setLoading(false);
    }

    function FileSizeBlock({ val, name }: { val: number, name: string }) {
        return <>
            <Button
                text={toMb(val)}
                onClick={() => props.setOpenModal(name)}
            />
            <Modal
                show={props.openModal === name}
                onClose={() => props.setOpenModal(undefined)}
            >
                <Modal.Header>Details for file size: </Modal.Header>
                <Modal.Body className="bg-black">
                    <div className="mt-4 p-4 bg-black-100 rounded">
                        <pre className="blackspace-pre-wrap text-white">
                            {val} bytes
                        </pre>
                    </div>
                </Modal.Body>
            </Modal >
        </>
    }

    function GenWitnessButton() {
        return <Button
            className="bg-white hover:bg-blue-50 disabled:bg-opacity-20 w-full p-3 rounded text-black"
            text={'Infer w/ Network Good'}
            disabled={loading}
            loading={loading}
            loadingText={'…'}
            onClick={doGenWitness}
        />
    }

    function GenProofButton() {
        return <Button
            className="bg-white hover:bg-blue-50 disabled:bg-opacity-20 w-full p-3 rounded text-black"
            text="Prove w/ Network Good"
            disabled={loading}
            loading={loading}
            loadingText={'…'}
            onClick={doGenProof}
        />
    }

    function GenWitnessBadButton() {
        return <Button
            className="bg-white hover:bg-blue-50 disabled:bg-opacity-20 w-full p-3 rounded text-black"
            text={'Infer w/ Network Bad'}
            disabled={loading}
            loading={loading}
            loadingText={'…'}
            onClick={doGenWitnessBad}
        />
    }

    function GenProofBadButton() {
        return <Button
            className="bg-white hover:bg-blue-50 disabled:bg-opacity-20 w-full p-3 rounded text-black"
            text="Prove w/ Network Bad"
            disabled={loading}
            loading={loading}
            loadingText={'…'}
            onClick={doGenProofBad}
        />
    }

    function ResetButton() {
        return (
            <Button
                className="bg-white hover:bg-blue-50 w-full p-3 rounded text-black"
                text={'Reset All'}
                onClick={doReset}
            />
        )
    }

    function RetrieveUserData() {
        return (
            <Button
                className="text-xl bg-white hover:bg-blue-50 w-full p-3 rounded text-black"
                text={'Refresh'}
                disabled={loading}
                loading={loading}
                loadingText={'…'}
                onClick={doRetrieveUserData}
            />
        )
    }

    return (
        <>

            <Section>

                <Title>AI Company Dashboard</Title>

                <SubTitle>Available Models:</SubTitle>

                {!models && <CenteredSubTitle>EMPTY</CenteredSubTitle>}
                {models?.length === 2 && <TwoColumns
                    left={<TwoRows top={<>{models[1]?.name}</>} bottom={<FileSizeBlock val={models[1]?.size} name="l" />} />}
                    right={<TwoRows top={<>{models[0]?.name}</>} bottom={<FileSizeBlock val={models[0]?.size} name="r" />} />}
                />}

                <Spacer />

                <SubTitle>Infer and Prove:</SubTitle>

                <CenteredButtonWrapper>
                    <RetrieveUserData/>
                </CenteredButtonWrapper>

                {(!jsons || !models) && <CenteredSubTitle>NO INPUT(S) / MODEL(S)</CenteredSubTitle>}
                {(models?.length === 2 && jsons?.length) && (
                    <Section>
                        <TwoColumns
                            left={<GenWitnessButton />}
                            right={<GenProofButton />}
                        />
                        <TwoColumns
                            left={<GenWitnessBadButton />}
                            right={<GenProofBadButton />}
                        />
                    </Section>
                )}

                {(models?.length && jsons?.length) && (
                    <CenteredButtonWrapper>
                        <ResetButton />
                    </CenteredButtonWrapper>
                )}

            </Section>

        </>
    )
}
