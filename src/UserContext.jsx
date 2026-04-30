import { createContext, useEffect, useState } from "react";
import { fetchIssueTypes, fetchProjects } from "./services/apiClient";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
	const [projects, setProjects] = useState([]);
	const [issueTypes, setIssueTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				setLoading(true);
				const [projectsData, issueTypesData] = await Promise.all([
					fetchProjects(),
					fetchIssueTypes(),
				]);
				setProjects(projectsData);
				setIssueTypes(issueTypesData);
			} catch (err) {
				console.error("Error loading initial data:", err);
				setError("Error loading projects and issue types: " + err.message);
			} finally {
				setLoading(false);
			}
		};

		loadInitialData();
	}, []);

	return (
		<UserContext.Provider
			value={{
				projects,
				issueTypes,
				loading,
				error,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};