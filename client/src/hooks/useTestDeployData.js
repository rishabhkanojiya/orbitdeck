import {
    simpleDeploy,
    multiDeploy,
    multiIngressDeploy,
} from "../common/constants/deployTestData";

export const useTestDeployData = (setValue, append, setSelectedRepo) => {
    const fillSimpleDeploy = () => {
        setValue("name", simpleDeploy.name);
        setValue("environment", simpleDeploy.environment);
        setValue("ingress", simpleDeploy.ingress);
        simpleDeploy.components.forEach((comp) => {
            append(comp);
        });
        setSelectedRepo(
            simpleDeploy.components.map((comp) => ({
                label: comp.name,
                value: comp.image.repository,
            })),
        );
    };

    const fillMultiDeploy = () => {
        setValue("name", multiDeploy.name);
        setValue("environment", multiDeploy.environment);
        setValue("ingress", multiDeploy.ingress);
        multiDeploy.components.forEach((comp) => {
            append(comp);
        });
        setSelectedRepo(
            multiDeploy.components.map((comp) => ({
                label: comp.name,
                value: comp.image.repository,
            })),
        );
    };

    const fillMultiIngressDeploy = () => {
        setValue("name", multiIngressDeploy.name);
        setValue("environment", multiIngressDeploy.environment);
        setValue("ingress", multiIngressDeploy.ingress);
        multiIngressDeploy.components.forEach((comp) => {
            append(comp);
        });
        setSelectedRepo(
            multiIngressDeploy.components.map((comp) => ({
                label: comp.name,
                value: comp.image.repository,
            })),
        );
    };

    return { fillSimpleDeploy, fillMultiDeploy, fillMultiIngressDeploy };
};
